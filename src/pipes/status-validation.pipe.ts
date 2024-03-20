import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Status } from 'src/enums/status.enum';

export class StatusValidationPipe implements PipeTransform {
  private readonly status = [Status.ACTIVE, Status.INACTIVE];
  transform(value: any) {
    let val = value.status;
    if (val) {
      val = val.toUpperCase();
      if (!this.isValidStatus(val)) {
        throw new BadRequestException({
          statusCode: 400,
          message: `Invalid status ${val}`,
        });
      }
      value.status = val;
    }

    return value;
  }
  private isValidStatus(status: any) {
    const idx = this.status.indexOf(status);
    return idx !== -1;
  }
}
