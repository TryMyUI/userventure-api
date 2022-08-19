export default (
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
) => `
    SELECT mvv.*,
           CASE WHEN ctc.error_click_count IS NULL THEN 0 ELSE ctc.error_click_count END AS error_click_count,
           CASE WHEN ctc.rage_click_count IS NULL then 0 ELSE ctc.rage_click_count END   AS rage_click_count,
           CASE WHEN ctc.dead_click_count IS NULL then 0 ELSE ctc.dead_click_count END   AS dead_click_count,
           count(*) OVER ()                                                              AS total_count
    FROM materialized_visitors_view AS mvv
             LEFT JOIN (
        SELECT idvisit,
               idsite,
               SUM(
                       IF(
                                   action_page_name = 'ErrorClick', 1,
                                   0
                           )
                   ) AS error_click_count,
               SUM(
                       IF(
                                   action_page_name = 'RageClick', 1,
                                   0
                           )
                   ) AS rage_click_count,
               SUM(
                       IF(
                                   action_page_name = 'DeadClick', 1,
                                   0
                           )
                   ) AS dead_click_count
        FROM (
                 SELECT mllva.idvisit,
                        mllva.idsite,
                        CASE WHEN mla_3.NAME IS NULL THEN 'page_view' ELSE mla_3.NAME END AS action_page_name,
                        mllva.server_time
                 FROM matomo_log_link_visit_action mllva
                          LEFT JOIN matomo_log_action mla_3 ON mla_3.idaction = mllva.idaction_event_action
                 WHERE mla_3.type IN (1, 4, 10, 11, 12)
                   and ${dateCondition_2}
                   AND mllva.idsite = ${siteId}
                 GROUP BY 1,
                          2,
                          3,
                          4
                 ORDER BY mllva.idvisit
             ) AS sub
        GROUP BY 1,
                 2
    ) AS ctc ON mvv.idvisit = ctc.idvisit
        AND mvv.idsite = ctc.idsite
    WHERE ${dateCondition_1}
      AND mvv.idsite = ${siteId}
      AND rage_click_count BETWEEN ${rage[0]} AND ${rage[1]}
      AND error_click_count BETWEEN ${error[0]} AND ${error[1]}
      AND dead_click_count BETWEEN ${dead[0]} AND ${dead[1]} ${deviceCondition} ${browserCondition} ${osCondition}
    ORDER BY visit_first_action_time DESC
        LIMIT ${paginatorDto.limit} OFFSET ${offset}
`;
