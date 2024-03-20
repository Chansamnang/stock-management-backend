import { BadRequestException, PipeTransform } from '@nestjs/common';

export class CreateProductValidationPipe implements PipeTransform {
  transform(value: any) {
    const quantity = value.quantity;
    const unitPrice = value.unitPrice;
    if (quantity <= 0 || unitPrice <= 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Quantity or Unit Price must be bigger than 0`,
      });
    }
    return value;
  }
}
