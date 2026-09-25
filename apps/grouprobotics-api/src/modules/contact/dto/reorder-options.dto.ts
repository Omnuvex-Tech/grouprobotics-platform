import { IsArray, IsInt } from 'class-validator';

export class ReorderOptionsDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}