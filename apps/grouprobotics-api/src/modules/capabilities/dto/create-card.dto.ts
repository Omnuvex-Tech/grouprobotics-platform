import { IsObject, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsObject()
  title!: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  description!: Record<string, string>;
}