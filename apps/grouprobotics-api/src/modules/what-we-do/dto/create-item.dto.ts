import { IsObject, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  description!: Record<string, string>;
}