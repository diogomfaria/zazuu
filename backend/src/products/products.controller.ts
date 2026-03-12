import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.productsService.create(createProductDto, req.user.id);
    }

    @Get()
    findAll(@Query() filters: FilterProductDto, @Request() req) {
        return this.productsService.findAll(filters, req.user.id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateProductDto>, @Request() req) {
        return this.productsService.update(id, updateData, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.productsService.remove(id, req.user.id);
    }
}