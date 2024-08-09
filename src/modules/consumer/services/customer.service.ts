import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateClientDto, FilterCustomerDto, UpdateClientDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';
import { Customer } from '../entities';
import { ReadingService } from './reading.service';
import { CustomerType } from 'src/modules/administration/entities';

interface uploadData {
  MEDIDOR: number;
  PATERNO: string;
  MATERNO: string;
  NOMBRES: string;
  CI: string;
  CELULAR: string;
  OTB: string;
  [key: string]: string | number;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerType) private customerTypeRepository: Repository<CustomerType>,
    private readingService: ReadingService,
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
      const { PATERNO, MATERNO, NOMBRES, CELULAR, OTB, MEDIDOR, CI, ...props } = item;
      const customer = this.customerRepository.create({
        firstname: NOMBRES,
        middlename: PATERNO,
        lastname: MATERNO,
        meterNumber: `${MEDIDOR}`,
        phone: CELULAR,
        dni: CI,
      });
      if (OTB.toUpperCase().trim() === 'SI') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 18 });
      }
      if (OTB.toUpperCase().trim() === 'NO') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 19 });
      }
      await this.customerRepository.save(customer);
      const dates = Object.entries(props)
        .map(([key, value]) => ({ date: this.parseMonthYearToEndOfMonthDate(key), value }))
        .sort((a, b) => {
          if (a.date.getTime() !== b.date.getTime()) {
            return a.date.getTime() - b.date.getTime();
          }
          return parseInt(`${a.value}`) - parseInt(`${b.value}`);
        });
      for (const [index, item] of dates.entries()) {
        if (index === 0) {
          await this.readingService.createReadingWithoutInvoice(
            parseInt(`${item.value}`),
            customer,
            item.date.getFullYear(),
            item.date.getMonth(),
          );
        } else {
          await this.readingService.create({ customerId: customer.id, reading: parseInt(`${item.value}`) }, item.date);
        }
      }
    }
    console.log('done!');
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
    const s = await this.customerRepository.find({
      where: [{ meterNumber: term }, { firstname: ILike(`%${term}%`) }],
      relations: { type: true },
      take: 5,
    });
    return s;
  }

  parseMonthYearToEndOfMonthDate(monthYear: string): Date {
    const [month, year] = monthYear.split('-').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    const endOfMonth = new Date(fullYear, month + 1, 0); // El día 0 del mes siguiente es el último día del mes actual
    return endOfMonth;
  }
}
