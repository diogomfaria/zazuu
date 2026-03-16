import { IsOptional, IsString } from 'class-validator';

export class FilterProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    minPrice?: string;

    @IsOptional()
    maxPrice?: string;
}