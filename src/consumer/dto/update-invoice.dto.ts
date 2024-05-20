import { ArrayMinSize, IsMongoId } from 'class-validator';

export class UpdateInvoiceDto {
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  id_invoices: string[];
}
