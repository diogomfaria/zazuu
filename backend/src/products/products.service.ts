import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto, userId: string) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                userId,
            },
        });
    }

    async findAll(filters: FilterProductDto, userId: string) {
        return this.prisma.product.findMany({
            where: {
                userId,
                name: filters.name ? { contains: filters.name, mode: 'insensitive' } : undefined,
                description: filters.description ? { contains: filters.description, mode: 'insensitive' } : undefined,
                price: {
                    gte: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
                    lte: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, updateData: Partial<CreateProductDto>, userId: string) {
        await this.verifyOwnership(id, userId);
        return this.prisma.product.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string, userId: string) {
        await this.verifyOwnership(id, userId);
        return this.prisma.product.delete({ where: { id } });
    }

    private async verifyOwnership(productId: string, userId: string) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        if (product.userId !== userId) {
            throw new ForbiddenException('Você não tem permissão para alterar este produto');
        }

        return product;
    }
} return this.prisma.product.delete({ where: { id } });
    }

    private async verifyOwnership(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
        throw new NotFoundException('Produto não encontrado');
    }

    if (product.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar este produto');
    }

    return product;
}
}