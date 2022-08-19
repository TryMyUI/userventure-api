import { Body, Controller, Get, Query, UseGuards, Param } from '@nestjs/common';

import { VisitorsService } from 'modules/visitors/visitors.service';
import { AuthGuard } from 'guards/auth.guard';
import { SiteId } from 'decorators/site-id.decorator';

@Controller('visitors')
@UseGuards(AuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Get('/')
  getVisitors(
    @Query() paginatorDto /*: TODO PaginatorDto*/,
    @Body() visitorsListDto /*: TODO VisitorsListDto*/,
    @SiteId() siteId,
  ) {
    return 1;
    // return this.visitorsService.getVisitors(visitorsListDto, siteId, paginatorDto);
  }

  @Get('/actions/:visitId')
  getVisitorActions(@Param('visitId') visitId: number) {
    return this.visitorsService.getVisitorActions(visitId);
  }
}
