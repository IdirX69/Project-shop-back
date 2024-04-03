// product.dto.ts

import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly price: string; // Mettre à jour le type de prix en nombre

  @IsString()
  readonly image: string;

  @IsArray()
  @IsOptional()
  readonly categoryIds?: number[];
}
