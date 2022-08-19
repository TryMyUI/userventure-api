import { Injectable } from '@nestjs/common';

import { VisitorsListDto } from './dto/visitors-list.dto';
import { VisitorsLogDto } from './dto/visitors-log.dto';
import { PaginatorDto } from 'src/dto/paginator.dto';
import { MatomoQuery } from 'model/matomo/connection';
import { generateDateCondition } from 'utils/helpers';
import getVisitorActionRowsQuery from 'model/matomo/queries/visitors/get-visitor-action-rows.query';
import OperationResponse from 'src/operations/operation-response';
import GetVisitorsRows from 'model/matomo/queries/visitors/get-visitors-rows.query';
import getVisitorLogRowsByPageIdQuery from 'model/matomo/queries/visitors/get-visitor-log-rows-by-page-id.query';
import * as browserFamilies from 'utils/browser-families.json';

@Injectable()
export class VisitorsService {
  async getVisitors(visitorsListDto: VisitorsListDto, siteId: string, paginatorDto: PaginatorDto) {
    let success = true;
    let message = '';
    const resData: any = {
      ...paginatorDto,
      total: 0,
      rows: {},
    };

    try {
      const visitors: any = await this.getVisitorsRows(visitorsListDto, siteId, paginatorDto);

      if (visitors?.length) {
        this.mapVisitors(resData, visitors);
      }
    } catch (e) {
      success = false;
      message = e.message;
    }

    return new OperationResponse(success, resData, message);
  }

  async getVisitorActions(visitId) {
    let success = true;
    let message = 'ok';
    const resData: any = [];

    try {
      const actions = await MatomoQuery(getVisitorActionRowsQuery(visitId));

      if (actions && actions.length) {
        //Grouping events by page category , creating new action when page_category = 'page_view'
        for (let i = 0; i < actions.length; i++) {
          if (actions[i]['action_category'] === 'page_view') {
            actions[i].events = [];
            resData.push(actions[i]);
          } else {
            if (resData[resData.length - 1]) {
              resData[resData.length - 1].events.push(actions[i]);
            }
          }
        }
      }
    } catch (e) {
      success = false;
      message = e.message;
    }

    return new OperationResponse(success, resData, message);
  }

  async getVisitorLogs(visitorsLogDto: VisitorsLogDto, siteId: string, paginatorDto: PaginatorDto) {
    let success = true;
    let message = 'ok';
    const resData: any = {
      ...paginatorDto,
      total: 0,
      rows: {},
    };

    try {
      const visitors: any = await this.getVisitorLogRowsByPageId(
        visitorsLogDto,
        siteId,
        paginatorDto,
      );

      if (visitors?.length) {
        this.mapVisitors(resData, visitors);
      }
    } catch (e) {
      success = false;
      message = e.message;
    }
    return new OperationResponse(success, resData, message);
  }

  async getVisitorsRows(
    visitorsListDto: VisitorsListDto,
    siteId: string,
    paginatorDto: PaginatorDto,
  ) {
    const {
      clicks: { error, dead, rage },
      device_type = [],
      os = [],
      browser_type = [],
      filterDate,
    } = visitorsListDto;
    const offset = (Number(paginatorDto.page) - 1) * Number(paginatorDto.limit);

    const dateCondition_1 = generateDateCondition(`mvv.server_time`, filterDate);
    const dateCondition_2 = generateDateCondition(`mllva.server_time`, filterDate);

    let deviceCondition = ``;
    let browserCondition = ``;
    let osCondition = ``;
    if (device_type && device_type.length) {
      deviceCondition = `and config_device_type IN (${device_type.join(', ')})`;
    }

    const allBrowserTypes: any = browserFamilies;

    if (browser_type && browser_type.length) {
      let allAcceptedTypes: any = [];
      if (browser_type.includes('other')) {
        const browserTypesList = ['Chrome', 'Internet Explorer', 'Firefox', 'Safari'];

        for (const type of browserTypesList) {
          if (browser_type.length === 1) {
            //if selected only other type
            if (allBrowserTypes[type]) {
              allAcceptedTypes = [...allAcceptedTypes, ...allBrowserTypes[type]];
            }
          } else {
            if (allBrowserTypes[type] && !browser_type.includes(type)) {
              allAcceptedTypes = [...allAcceptedTypes, ...allBrowserTypes[type]];
            }
          }
        }
        browserCondition = `and config_browser_name NOT IN (${allAcceptedTypes.join(', ')})`;
      } else {
        for (const type of browser_type) {
          if (allBrowserTypes[type]) {
            allAcceptedTypes = [...allAcceptedTypes, ...allBrowserTypes[type]];
          }
        }
        browserCondition = `and config_browser_name IN (${allAcceptedTypes.join(', ')})`;
      }
    }

    if (os && os.length) {
      if (os.includes('other')) {
        const allOsTypes = ['IOS', 'AND', 'WIN', 'UBT'];
        const restrictedOsTypes: string[] = [];
        for (const type of allOsTypes) {
          if (!os.includes(type)) {
            restrictedOsTypes.push(type);
          }
        }
        osCondition = `and config_os NOT IN (${restrictedOsTypes.join(', ')})`;
      } else {
        osCondition = `and config_os IN (${os.join(', ')})`;
      }
    }

    return MatomoQuery(
      GetVisitorsRows(
        dateCondition_1,
        dateCondition_2,
        siteId,
        rage,
        error,
        dead,
        deviceCondition,
        browserCondition,
        osCondition,
        paginatorDto,
        offset,
      ),
    );
  }

  async getVisitorLogRowsByPageId(
    visitorsLogDto: VisitorsLogDto,
    siteId: string,
    paginatorDto: PaginatorDto,
  ) {
    const offset = (Number(paginatorDto.page) - 1) * Number(paginatorDto.limit);
    const { filterDate } = visitorsLogDto;

    const dateCondition = generateDateCondition(`mvv.server_time`, filterDate);
    const dateCondition_2 = generateDateCondition(`mllva.server_time`, filterDate);

    return MatomoQuery(
      getVisitorLogRowsByPageIdQuery(
        dateCondition,
        dateCondition_2,
        siteId,
        visitorsLogDto,
        paginatorDto,
        offset,
      ),
    );
  }

  mapVisitors(resData, visitors) {
    resData.total = visitors[0]['total_count'];
    for (let i = 0; i < visitors.length; i++) {
      const row = visitors[i];
      row.key = Date.now() + '_' + i;
      const key = row['server_time'].split('T')[0];
      if (!resData.rows.hasOwnProperty(key)) {
        resData.rows[key] = [row];
      } else {
        resData.rows[key].push(row);
      }
    }
  }
}
