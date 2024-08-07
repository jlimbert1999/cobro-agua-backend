import { ArrayMinSize, IsInt } from 'class-validator';

export class PaymentDto {
  @IsInt({ each: true })
  @ArrayMinSize(1)
  invoiceIds: number[];
}
