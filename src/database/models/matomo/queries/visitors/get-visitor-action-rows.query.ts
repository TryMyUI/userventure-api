export default (visitId) => `
SELECT mllva.idvisit     AS visitId,
       mllva.idsite      AS siteId,
       CASE
           WHEN mla_2.name IS NULL THEN 'page_view'
           ELSE mla_2.name
           END           AS action_category,
       CASE
           WHEN mla_3.name IS NULL THEN 'page_view'
           ELSE mla_3.name
           END           AS action_page_name,
       mla.name          AS action_page_name_detail,
       mla_4.name        AS url_name,
       mllva.server_time AS time_of_action
FROM matomo_log_link_visit_action mllva
         LEFT JOIN matomo_log_action mla ON mla.idaction = mllva.idaction_name
         LEFT JOIN matomo_log_action mla_2
                   ON mla_2.idaction = mllva.idaction_event_category
         LEFT JOIN matomo_log_action mla_3 ON mla_3.idaction = mllva.idaction_event_action
         LEFT JOIN matomo_log_action mla_4 ON mla_4.idaction = mllva.idaction_url
WHERE mla.type IN (1, 4, 10, 11, 12)
  AND mllva.idvisit = ${visitId}
ORDER BY mllva.idvisit,
         mllva.server_time
`;
