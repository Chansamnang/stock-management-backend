import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBaseDto } from '../common/base.search.dto';
import { Status } from 'src/enums/status.enum';

export class ProductSearchDto extends SearchBaseDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  descripion: string;

  @ApiPropertyOptional({ example: `${Status.ACTIVE}, ${Status.INACTIVE}` })
  status: Status;
}
