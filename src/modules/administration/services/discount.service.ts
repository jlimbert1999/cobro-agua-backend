import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from '../entities';
import { ILike, Repository } from 'typeorm';
import { PaginationParamsDto } from 'src/common/dtos';
import { CreateDiscountDto, UpdateDiscountDto } from '../dtos';

@Injectable()
export class DiscountService {
  constructor(@InjectRepository(Discount) private discountRespository: Repository<Discount>) {}

  async findAll({ limit, offset, term }: PaginationParamsDto) {
    const [discounts, length] = await this.discountRespository.findAndCount({
      ...(term && { where: { name: ILike(`%${term}%`) } }),
      take: limit,
      skip: offset,
      order: { id: 'DESC' },
    });
    return { discounts, length };
  }

  async create(discountDto: CreateDiscountDto) {
    const createdDiscount = this.discountRespository.create(discountDto);
    await this.discountRespository.save(createdDiscount);
    return createdDiscount;
  }

  async update(id: number, discountDto: UpdateDiscountDto) {
    const discount = await this.discountRespository.preload({ id, ...discountDto });
    if (!discount) throw new NotFoundException(`Discount ${id} not found`);
    return await this.discountRespository.save(discount);
  }

  async getEnabled() {
    return await this.discountRespository.find({});
  }
}
