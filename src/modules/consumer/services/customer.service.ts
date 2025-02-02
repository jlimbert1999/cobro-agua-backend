import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateClientDto, FilterCustomerDto, UpdateClientDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';
import { Customer } from '../entities';
import { ReadingService } from './reading.service';
import { CustomerType, Discount } from 'src/modules/administration/entities';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerType) private customerTypeRepository: Repository<CustomerType>,
    @InjectRepository(Discount) private discountRepository: Repository<Discount>,
    private readingService: ReadingService,
  ) {}

  async findAll(paginationParams: PaginationParamsDto, filterParams: FilterCustomerDto) {
    const query = this._buildFilter(paginationParams, filterParams);
    const [clients, length] = await query.getManyAndCount();
    return { clients, length };
  }

  async create(customer: CreateClientDto) {
    const { discountId, ...props } = customer;
    await this._chechDuplicanteDni(customer.dni);
    const type = await this.customerTypeRepository.findOneBy({ id: customer.type });
    const discount = discountId ? await this.discountRepository.findOneBy({ id: customer.discountId }) : null;
    const createdCustomer = this.customerRepository.create({ ...props, type, discount });
    return await this.customerRepository.save(createdCustomer);
  }

  async update(id: number, clientDto: UpdateClientDto) {
    const { type, discountId, ...toUpdate } = clientDto;
    const clientDB = await this.customerRepository.findOne({ where: { id }, relations: { type: true } });
    if (!clientDB) throw new NotFoundException(`Customer with ${id} dont exist`);
    if (clientDB.dni !== clientDto.dni) await this._chechDuplicanteDni(clientDto.dni);
    if (type !== clientDB.type.id) {
      clientDB.type = await this.customerTypeRepository.findOneBy({ id: type });
    }
    clientDB.discount = discountId ? await this.discountRepository.findOneBy({ id: discountId }) : null;
    return await this.customerRepository.save({ ...clientDB, ...toUpdate });
  }

  private async _chechDuplicanteDni(dni: string): Promise<void> {
    const duplicate = await this.customerRepository.findOneBy({ dni });
    if (duplicate) throw new BadRequestException(`Duplicate dni: ${dni}`);
  }

  private _buildFilter(params: PaginationParamsDto, filterParams: FilterCustomerDto) {
    const query = this.customerRepository.createQueryBuilder('customer');
    if (filterParams.fullname) {
      query.where(
        "LOWER(CONCAT_WS(' ', customer.firstname, customer.middlename, customer.lastname)) LIKE LOWER(:fullname)",
        { fullname: `%${filterParams.fullname}%` },
      );
    }
    if (filterParams.meterNumber) {
      query.andWhere('customer.meterNumber = :meterNumber', {
        meterNumber: filterParams.meterNumber,
      });
    }
    if (filterParams.dni) {
      query.andWhere('customer.dni = :dni', { dni: filterParams.dni });
    }
    if (filterParams.type) {
      query.andWhere('customer.typeId = :type', { type: filterParams.type });
    }
    if (filterParams.status) {
      query.andWhere('customer.status = :status', { status: filterParams.status });
    }
    return query
      .leftJoinAndSelect('customer.type', 'type')
      .leftJoinAndSelect('customer.discount', 'discount')
      .orderBy('customer.createdAt', 'DESC')
      .skip(params.offset)
      .take(params.limit);
  }

  async searchByMeterNumber(term: string) {
    return await this.customerRepository.find({
      where: [{ meterNumber: term }, { firstname: ILike(`%${term}%`) }],
      relations: { type: true, discount: true },
      take: 5,
    });
  }

  parseMonthYearToEndOfMonthDate(monthYear: string): Date {
    const [month, year] = monthYear.split('-').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    const endOfMonth = new Date(fullYear, month + 1, 0); // El día 0 del mes siguiente es el último día del mes actual
    return endOfMonth;
  }
}
