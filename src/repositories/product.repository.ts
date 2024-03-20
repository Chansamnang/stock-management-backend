import { BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/product/create.dto';
import { ProductSearchDto } from 'src/dto/product/product-search.dto';
import { Product } from 'src/entities/product';
import { ApiResponse } from 'src/utils/api-response.util';
import { splitDateRange } from 'src/utils/helper.util';
import { Between, Equal, Like, Repository } from 'typeorm';

export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    super(
      productRepository.target,
      productRepository.manager,
      productRepository.queryRunner,
    );
  }

  async findAllProduct(reqBody: ProductSearchDto) {
    const option = {
      where: {},
      select: {
        id: true,
        name: true,
        description: true,
        unit_price: true,
        status: true,
        category: {
          id: true,
          name: true,
        },
        quantity: true,
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
        category: true,
        created_by: true,
        updated_by: true,
      },
    };
    if (reqBody.name) {
      option.where['name'] = Like(`%${reqBody.name}%`);
    }
    if (reqBody.descripion) {
      option.where['descripion'] = Like(`%${reqBody.descripion}%`);
    }
    if (reqBody.status) {
      option.where['status'] = Equal(reqBody.status);
    }
    if (reqBody.createdDate) {
      const { startDate, endDate } = splitDateRange(reqBody.createdDate);
      option.where['created_at'] = Between(startDate, endDate);
    }
    const [list, count] = await this.productRepository.findAndCount({
      ...option,
      order: { id: 'DESC' },
      take: reqBody.limit,
      skip: reqBody.offset,
    });
    return ApiResponse({ list, count }, HttpStatus.OK, 'Sucess');
  }

  async createProduct(userId: any, reqBody: CreateProductDto) {
    const existProduct = await this.findProductByNameAndCategoryId(
      reqBody.name,
      reqBody.categoryId,
    );
    if (existProduct != null) {
      if (existProduct.name === reqBody.name) {
        throw new BadRequestException(`Product: ${reqBody.name} already exist`);
      }
    }
    const product = this.productRepository.create({
      name: reqBody.name,
      description: reqBody.description,
      quantity: reqBody.quantity,
      status: reqBody.status,
      unit_price: reqBody.unitPrice,
      category: { id: reqBody.categoryId },
      created_by: userId,
    });

    return await this.productRepository.save(product);
  }

  async findProductByNameAndCategoryId(
    productName: string,
    categoryId: number,
  ) {
    const product = await this.productRepository.findOne({
      where: {
        name: productName,
        category: {
          id: categoryId,
        },
      },
      relations: ['category'],
    });
    return product;
  }

  async findProductByCategoryId(categoryId: number) {
    const list = await this.productRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
      relations: ['category'],
      order: { id: 'DESC' },
    });
    return list;
  }
}
