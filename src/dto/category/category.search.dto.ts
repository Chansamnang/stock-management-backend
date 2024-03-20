import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBaseDto } from '../common/base.search.dto';
import { Status } from 'src/enums/status.enum';

export class CategorySearchDto extends SearchBaseDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional({ example: `${Status.ACTIVE}, ${Status.INACTIVE}` })
  status: Status;
}
