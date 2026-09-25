import { IsArray, IsInt } from 'class-validator';

export class ReorderCardsDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}