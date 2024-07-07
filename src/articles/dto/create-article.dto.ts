// create-article.dto.ts
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateArticleDto {
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
  @IsString()
  image: string;
}
