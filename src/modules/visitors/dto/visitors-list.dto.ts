import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class DateRange {
  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;
}
export class VisitDate {
  @IsNotEmpty()
  @IsString()
  type: 'date' | 'range' | 'month' | 'year';

  @IsNotEmpty()
  @Type(() => DateRange)
  @ValidateNested()
  @ValidateIf((object, value) => typeof value !== 'string')
  date: string | DateRange;
}
export class Clicks {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  error: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  rage: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  dead: number[];
}

export class VisitorsListDto {
  @Type(() => VisitDate)
  @ValidateNested()
  @IsNotEmpty()
  filterDate: VisitDate;

  @Type(() => Clicks)
  @ValidateNested()
  @IsNotEmpty()
  clicks: Clicks;

  @IsArray()
  @IsOptional()
  device_type: string[];

  @IsArray()
  @IsOptional()
  os: string[];

  @IsArray()
  @IsOptional()
  browser_type: string[];
}
