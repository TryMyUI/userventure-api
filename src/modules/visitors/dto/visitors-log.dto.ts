import { IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DateRange {
  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;
}

class VisitDate {
  @IsNotEmpty()
  @IsString()
  type: 'date' | 'range' | 'month' | 'year';

  @IsNotEmpty()
  @Type(() => DateRange)
  @ValidateNested()
  @ValidateIf((object, value) => typeof value !== 'string')
  date: string | DateRange;
}

export class VisitorsLogDto {
  @IsNotEmpty()
  pageId: string | number;

  @Type(() => VisitDate)
  @ValidateNested()
  @IsNotEmpty()
  filterDate: VisitDate;
}
