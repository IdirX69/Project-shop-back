// product.dto.ts

import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly image: string;

  @IsArray()
  @IsOptional()
  readonly categoryIds?: number[];
}
