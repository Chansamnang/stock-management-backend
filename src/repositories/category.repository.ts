import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorySearchDto } from 'src/dto/category/category.search.dto';
import { CreateCategoryDto } from 'src/dto/category/create.dto';
import { UpdateCategoryDto } from 'src/dto/category/update.dto';
import { Cateogry } from 'src/entities/category';
import { ApiResponse } from 'src/utils/api-response.util';
import { splitDateRange } from 'src/utils/helper.util';
import { Between, Equal, Like, Repository } from 'typeorm';

export class CategoryRepository extends Repository<Cateogry> {
  constructor(
    @InjectRepository(Cateogry)
    private categoryRepository: Repository<Cateogry>,
  ) {
    super(
      categoryRepository.target,
      categoryRepository.manager,
      categoryRepository.queryRunner,
    );
  }

  async createCategory(userId: any, reqBody: CreateCategoryDto) {
    const existCategory = await this.findByName(reqBody.name);
    if (existCategory != null) {
      throw new BadRequestException(`category:${reqBody.name} already existed`);
    }

    const newCategory = this.categoryRepository.create({
      name: reqBody.name,
      status: reqBody.status,
      created_by: userId,
    });

    await this.categoryRepository.save(newCategory);

    return ApiResponse(
      newCategory,
      HttpStatus.OK,
      'Category Created Successfully',
    );
  }

  async findById(id: number) {
    return await this.categoryRepository.findOneBy({ id: id });
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOneBy({ name: name });
  }

  async findAllCategory(reqBody: CategorySearchDto) {
    const option = {
      where: {},
      select: {
        id: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
        created_by: {
          id: true,
          username: true,
        },
        updated_by: {
          id: true,
          username: true,
        },
      },
      relations: {
        created_by: true,
        updated_by: true,
      },
    };

    if (reqBody.name) {
      option.where['name'] = Like(`%${reqBody.name}%`);
    }

    if (reqBody.status) {
      option.where['status'] = Equal(reqBody.status);
    }

    if (reqBody.createdDate) {
      const { startDate, endDate } = splitDateRange(reqBody.createdDate);
      option.where['created_at'] = Between(startDate, endDate);
    }

    const [list, count] = await this.categoryRepository.findAndCount({
      ...option,
      order: { id: 'DESC' },
      skip: reqBody.offset,
      take: reqBody.limit,
    });

    return ApiResponse({ list, count }, HttpStatus.OK, 'success');
  }

  async updateCategoryById(userId: any, reqBody: UpdateCategoryDto) {
    const existCategory = await this.findById(reqBody.categoryId);
    if (existCategory == null) {
      throw new NotFoundException('Category Not found');
    }

    const existCategoryName = await this.findByName(reqBody.name);
    if (existCategory.name !== reqBody.name && existCategoryName != null) {
      throw new BadRequestException(`category:${reqBody.name} already existed`);
    }

    existCategory.name = reqBody.name;
    existCategory.status = reqBody.status;
    existCategory.updated_by = userId;

    await this.categoryRepository.save(existCategory);

    return ApiResponse(null, HttpStatus.OK, 'Update Success');
  }
}
