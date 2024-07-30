import { ArrayMinSize, IsMongoId } from 'class-validator';

export class UpdateReadingDto {
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  readingsIds: string[];
}
