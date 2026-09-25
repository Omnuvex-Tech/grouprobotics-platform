import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProblemSolutionDto {
  @IsOptional()
  @IsObject()
  badge?: Record<string, string>;

  @IsOptional()
  @IsObject()
  headline?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}