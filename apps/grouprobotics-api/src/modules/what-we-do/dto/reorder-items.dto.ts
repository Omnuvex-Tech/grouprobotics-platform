import { IsArray, IsInt } from 'class-validator';

export class ReorderItemsDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}