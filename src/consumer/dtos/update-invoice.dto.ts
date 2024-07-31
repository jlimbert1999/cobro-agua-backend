import { ArrayMinSize, IsInt } from 'class-validator';

export class UpdateInvoiceDto {
  @IsInt({ each: true })
  @ArrayMinSize(1)
  invoiceIds: number[];
}
