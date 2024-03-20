import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from 'src/dto/product/create.dto';
import { ProductSearchDto } from 'src/dto/product/product-search.dto';
import { UpdateProductDto } from 'src/dto/product/update.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ApiResponse } from 'src/utils/api-response.util';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async create(userId: any, reqBody: CreateProductDto) {
    const existCategory = await this.categoryRepository.findById(
      reqBody.categoryId,
    );
    if (existCategory == null) {
      throw new BadRequestException('Product Category not found');
    }
    return this.productRepository.createProduct(userId, reqBody);
  }

  findAllProduct(reqBody: ProductSearchDto) {
    return this.productRepository.findAllProduct(reqBody);
  }

  async findProductById(id: number) {
    const product = await this.productRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        unit_price: true,
        category: {
          id: true,
          name: true,
        },
      },
      where: { id: id },
      relations: ['category'],
    });
    if (!product) {
      throw new BadRequestException('Product Not Found');
    }
    return product;
  }

  async updateProduct(userId: any, reqBody: UpdateProductDto) {
    const oldProduct = await this.findProductById(reqBody.productId);
    const existCategory = await this.categoryRepository.findById(
      reqBody.categoryId,
    );
    if (!existCategory) {
      throw new BadRequestException('Category not exist');
    }

    if (reqBody.categoryId !== oldProduct.category.id) {
      const existProduct =
        await this.productRepository.findProductByNameAndCategoryId(
          reqBody.name,
          reqBody.categoryId,
        );
      if (existProduct) {
        if (existProduct.name === reqBody.name) {
          throw new BadRequestException(`${existProduct.name} already exist`);
        }
      }
    }

    oldProduct.name = reqBody.name;
    oldProduct.description = reqBody.description;
    oldProduct.quantity = reqBody.quantity;
    oldProduct.unit_price = reqBody.unitPrice;
    oldProduct.category.id = reqBody.categoryId;
    oldProduct.updated_by = userId;

    await this.productRepository.save(oldProduct);
    return ApiResponse(null, HttpStatus.OK, 'Success');
  }

  async findProductByCategoryId(categoryId: number) {
    const list =
      await this.productRepository.findProductByCategoryId(categoryId);
    return ApiResponse(list, HttpStatus.OK, 'Success');
  }
}
