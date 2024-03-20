import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorySearchDto } from 'src/dto/category/category.search.dto';
import { CreateCategoryDto } from 'src/dto/category/create.dto';
import { UpdateCategoryDto } from 'src/dto/category/update.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ApiResponse } from 'src/utils/api-response.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  create(userId: any, reqBody: CreateCategoryDto) {
    return this.categoryRepository.createCategory(userId, reqBody);
  }

  async findById(id: number) {
    const categoryData = await this.categoryRepository.findById(id);
    return ApiResponse(categoryData, HttpStatus.OK, 'Success');
  }

  findAllCategory(reqBody: CategorySearchDto) {
    return this.categoryRepository.findAllCategory(reqBody);
  }

  updateById(userId: any, reqBody: UpdateCategoryDto) {
    return this.categoryRepository.updateCategoryById(userId, reqBody);
  }

  async deleteCategoryById(id: number) {
    const listProduct =
      await this.productRepository.findProductByCategoryId(id);

    if (listProduct.length > 0) {
      throw new BadRequestException(
        `This category is in used, can't be deleted`,
      );
    }
    const existCategory = await this.categoryRepository.findById(id);
    if (!existCategory) {
      throw new BadRequestException('Category Not Found');
    }
    this.categoryRepository.delete(id);
    return ApiResponse(null, HttpStatus.OK, 'Success');
  }
}
