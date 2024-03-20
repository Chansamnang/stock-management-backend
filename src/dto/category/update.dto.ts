import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class UpdateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: `${Status.ACTIVE}, ${Status.INACTIVE}`,
  })
  @IsNotEmpty()
  status: Status;
}
