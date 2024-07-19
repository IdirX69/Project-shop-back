// create-product.dto.ts
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
