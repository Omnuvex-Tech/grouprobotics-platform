import { IsArray, IsInt } from 'class-validator';

export class ReorderLinksDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}