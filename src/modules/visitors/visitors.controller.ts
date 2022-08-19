import { Body, Controller, Get, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VisitorsService } from 'modules/visitors/visitors.service';
import { SiteId } from 'decorators/site-id.decorator';
import { PaginatorDto } from 'src/dto/paginator.dto';
import { VisitorsListDto } from 'modules/visitors/dto/visitors-list.dto';
import { VisitorsLogDto } from 'modules/visitors/dto/visitors-log.dto';
import { AuthGuard } from 'guards/auth.guard';

@Controller('visitors')
@ApiTags('Visitors')
@UseGuards(AuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Get('/')
  getVisitors(
    @Query() paginatorDto: PaginatorDto,
    @Body() visitorsListDto: VisitorsListDto,
    @SiteId() siteId,
  ) {
    return this.visitorsService.getVisitors(visitorsListDto, siteId, paginatorDto);
  }

  @Get('/actions/:visitId')
  getVisitorActions(@Param('visitId', ParseIntPipe) visitId: number) {
    return this.visitorsService.getVisitorActions(visitId);
  }

  @Get('/visitor-logs')
  getVisitorLogs(
    @Query() paginatorDto: PaginatorDto,
    @Body() visitorsLogDto: VisitorsLogDto,
    @SiteId() siteId: string,
  ) {
    return this.visitorsService.getVisitorLogs(visitorsLogDto, siteId, paginatorDto);
  }
}
