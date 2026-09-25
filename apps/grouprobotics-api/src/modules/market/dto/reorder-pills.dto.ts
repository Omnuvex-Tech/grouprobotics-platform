import { IsArray, IsInt } from 'class-validator';

export class ReorderPillsDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}