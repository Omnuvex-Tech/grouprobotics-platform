import { IsArray, IsInt } from 'class-validator';

export class ReorderTagsDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];
}