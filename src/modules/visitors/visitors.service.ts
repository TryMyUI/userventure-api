import { Injectable } from '@nestjs/common';

import { MatomoQuery } from 'model/matomo/connection';
import getVisitorActionRowsQuery from 'model/matomo/queries/visitors/get-visitor-action-rows.query';
import OperationResponse from 'src/operations/operation-response';

@Injectable()
export class VisitorsService {
  async getVisitors() {
    return {};
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
}
