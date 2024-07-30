import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClientDto, FilterCustomerDto, UpdateClientDto } from '../dtos';
import { Customer } from '../entities';
import { CustomerType } from 'src/administration/entities';
import { PaginationParamsDto } from 'src/common/dtos';

interface uploadData {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  meterNumber: string;
  otb: string | null;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerType) private customerTypeRepository: Repository<CustomerType>,
  ) {}

  async findAll(paginationParams: PaginationParamsDto, filterParams: FilterCustomerDto) {
    const query = this._buildFilter(paginationParams, filterParams);
    const [clients, length] = await query.getManyAndCount();
    return { clients, length };
  }

  async create(customer: CreateClientDto) {
    await this._chechDuplicanteDni(customer.dni);
    const type = await this.customerTypeRepository.findOneBy({ id: customer.type });
    const createdCustomer = this.customerRepository.create({ ...customer, type });
    return await this.customerRepository.save(createdCustomer);
  }

  async update(id: string, clientDto: UpdateClientDto) {
    const { type, ...toUpdate } = clientDto;
    const clientDB = await this.customerRepository.findOne({ where: { id }, relations: { type: true } });
    if (!clientDB) throw new NotFoundException(`Customer with ${id} dont exist`);
    if (clientDB.dni !== clientDto.dni) await this._chechDuplicanteDni(clientDto.dni);
    if (type !== clientDB.type.id) {
      clientDB.type = await this.customerTypeRepository.findOneBy({ id: type });
    }
    return await this.customerRepository.save({ ...clientDB, ...toUpdate });
  }

  async uploadData(data: uploadData[]) {
    for (const item of data) {
      const { otb, ...props } = item;
      const customer = this.customerRepository.create(props);
      if (otb === 'SI') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 16 });
      }
      if (otb === 'NO') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 17 });
      }
      await this.customerRepository.save(customer);
    }
    return { ok: true };
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
      .orderBy('customer.createdAt', 'DESC')
      .skip(params.offset)
      .take(params.limit);
  }

  async searchByMeterNumber(term: string) {
    return await this.customerRepository.find({ where: { meterNumber: term }, relations: { type: true }, take: 5 });
  }
}
