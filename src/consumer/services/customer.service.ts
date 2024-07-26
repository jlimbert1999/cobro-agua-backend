import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto, UpdateClientDto } from '../dto';
import { ILike, Repository } from 'typeorm';
import { Customer } from '../entities';
import { CustomerType } from 'src/administration/entities';

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

  async findAll(limit: number, offset: number, term?: string) {
    const [clients, length] = await this.customerRepository.findAndCount({
      ...(term && { where: [{ meterNumber: ILike(`%${term}%`) }] }),
      take: limit,
      skip: offset,
      relations: { type: true },
    });
    return { clients, length };
  }

  async create(customer: CreateClientDto) {
    await this._chechDuplicanteDni(customer.dni);
    const createdCustomer = this.customerRepository.create(customer);
    return await this.customerRepository.save(createdCustomer);
  }

  async uploadData(data: uploadData[]) {
    for (const item of data) {
      const { otb, ...props } = item;
      const customer = this.customerRepository.create(props);
      if (otb === 'SI') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 14 });
      }
      if (otb === 'NO') {
        customer.type = await this.customerTypeRepository.findOneBy({ id: 15 });
      }
      await this.customerRepository.save(customer);
    }
    console.log('uplaodd');
    return { ok: true };
  }

  async update(id: number, clientDto: UpdateClientDto) {
    const clientDB = await this.customerRepository.preload({ id, ...clientDto });
    if (!clientDB) throw new NotFoundException(`Customer with ${id} dont exist`);
    if (clientDB.dni !== clientDto.dni) await this._chechDuplicanteDni(clientDto.dni);
    return await this.customerRepository.save(clientDB);
  }

  private async _chechDuplicanteDni(dni: string): Promise<void> {
    const duplicate = await this.customerRepository.findOneBy({ dni });
    if (duplicate) throw new BadRequestException(`Duplicate dni: ${dni}`);
  }
}
