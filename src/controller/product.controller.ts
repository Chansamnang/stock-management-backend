import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from 'src/dto/product/create.dto';
import { ProductSearchDto } from 'src/dto/product/product-search.dto';
import { UpdateProductDto } from 'src/dto/product/update.dto';
import { CreateProductValidationPipe } from 'src/pipes/create-product-validation.pipe';
import { StatusValidationPipe } from 'src/pipes/status-validation.pipe';
import { ProductService } from 'src/services/product.service';

@Controller('product')
@ApiTags('product-management')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  getAllProduct(@Query(new StatusValidationPipe()) reqBody: ProductSearchDto) {
    return this.productService.findAllProduct(reqBody);
  }

  @Get('/:id')
  getProductById(@Param('id') id: number) {
    return this.productService.findProductById(id);
  }

  @Post('create')
  createProduct(
    @Request() req,
    @Body(new StatusValidationPipe(), new CreateProductValidationPipe())
    reqBody: CreateProductDto,
  ) {
    const userId = req.user.id;
    return this.productService.create(userId, reqBody);
  }

  @Patch('update')
  updateProduct(
    @Request() req,
    @Body(new StatusValidationPipe()) reqBody: UpdateProductDto,
  ) {
    const userId = req.user.id;
    return this.productService.updateProduct(userId, reqBody);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: number) {
    return `not yet implemented`;
  }
}
