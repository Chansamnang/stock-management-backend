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
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategorySearchDto } from 'src/dto/category/category.search.dto';
import { CreateCategoryDto } from 'src/dto/category/create.dto';
import { UpdateCategoryDto } from 'src/dto/category/update.dto';
import { StatusValidationPipe } from 'src/pipes/status-validation.pipe';
import { CategoryService } from 'src/services/category.service';

@Controller('category')
@ApiTags('Category Management')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UsePipes(new StatusValidationPipe())
  createCategory(@Request() req, @Body() reqBody: CreateCategoryDto) {
    return this.categoryService.create(req.user.id, reqBody);
  }

  @Get('')
  @UsePipes(new StatusValidationPipe())
  getAllCategory(@Query() reqBody: CategorySearchDto) {
    return this.categoryService.findAllCategory(reqBody);
  }

  @Get('/:id')
  getCategoryById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  @Patch('/:id')
  updateCategory(@Request() req, @Body() reqBody: UpdateCategoryDto) {
    return this.categoryService.updateById(req.user.id, reqBody);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategoryById(id);
  }
}
