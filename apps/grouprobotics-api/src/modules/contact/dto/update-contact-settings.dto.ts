import { IsObject, IsOptional } from 'class-validator';

export class UpdateContactSettingsDto {
  @IsOptional() @IsObject() badge?: Record<string, string>;
  @IsOptional() @IsObject() title?: Record<string, string>;
  @IsOptional() @IsObject() description?: Record<string, string>;
  @IsOptional() @IsObject() nameLabel?: Record<string, string>;
  @IsOptional() @IsObject() namePlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() phoneLabel?: Record<string, string>;
  @IsOptional() @IsObject() phonePlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() companyLabel?: Record<string, string>;
  @IsOptional() @IsObject() companyPlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() emailLabel?: Record<string, string>;
  @IsOptional() @IsObject() emailPlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() interestLabel?: Record<string, string>;
  @IsOptional() @IsObject() interestPlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() messageLabel?: Record<string, string>;
  @IsOptional() @IsObject() messagePlaceholder?: Record<string, string>;
  @IsOptional() @IsObject() sendLabel?: Record<string, string>;
}