import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';

import { CustomerType, Preference } from '../entities';
import { CreateCustomerTypeDto, PreferenceDto, UpdateCustomerTypeDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';

@Injectable()
export class CustomerTypeService {
  constructor(
    @InjectRepository(CustomerType) private customerTypeRepository: Repository<CustomerType>,
    @InjectRepository(Preference) private preferenceRepository: Repository<Preference>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll({ limit, offset, term }: PaginationParamsDto) {
    const [customerTypes, length] = await this.customerTypeRepository.findAndCount({
      ...(term && { where: { name: ILike(`%${term}%`) } }),
      take: limit,
      skip: offset,
      relations: { preferences: true },
    });
    return { customerTypes, length };
  }

  async create(customerTypeDto: CreateCustomerTypeDto) {
    const { preferences = [], ...props } = customerTypeDto;
    const isValid = this._checkRange(preferences);
    if (!isValid) throw new BadRequestException('Los rango son invalidos');
    const customerType = this.customerTypeRepository.create({
      ...props,
      preferences: preferences.map((preference) => this.preferenceRepository.create(preference)),
    });
    await this.customerTypeRepository.save(customerType);
    return customerType;
  }

  async update(id: number, customerTypeDto: UpdateCustomerTypeDto) {
    const { preferences, ...topUpdate } = customerTypeDto;
    const customerType = await this.customerTypeRepository.preload({ id, ...topUpdate });
    if (!customerType) throw new NotFoundException(`Customer type with id: ${id} not found`);
    const isValid = this._checkRange(preferences);
    if (!isValid) throw new BadRequestException('Los rango son invalidos');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (preferences) {
        await queryRunner.manager.delete(Preference, { customerType: id });
        customerType.preferences = preferences.map((preference) => this.preferenceRepository.create(preference));
      }
      await queryRunner.manager.save(customerType);
      await queryRunner.commitTransaction();
      return await this._findOnePlain(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al actualizar sucursal');
    } finally {
      await queryRunner.release();
    }
  }

  async searchAvailables(term?: string) {
    return await this.customerTypeRepository.find({
      ...(term && { where: { name: ILike(`%${term}%`) }, take: 5 }),
    });
  }

  private async _findOnePlain(id: number) {
    return await this.customerTypeRepository.findOne({
      where: { id },
      relations: { preferences: true },
    });
  }

  private _checkRange(ranges: PreferenceDto[]): boolean {
    const valid = ranges.every(({ minUnits, maxUnits }) => minUnits < maxUnits);
    if (!valid) return false;
    return !ranges
      .sort((a, b) => a.minUnits - b.minUnits)
      .some(({ maxUnits }, index) => index < ranges.length - 1 && maxUnits >= ranges[index + 1].minUnits);
  }
}
