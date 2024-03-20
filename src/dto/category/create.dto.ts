import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: Status.ACTIVE,
    example: `${Status.ACTIVE}, ${Status.INACTIVE}`,
  })
  @IsNotEmpty()
  status: Status;
}
