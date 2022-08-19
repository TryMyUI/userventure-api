import { VisitDate } from 'modules/visitors/dto/visitors-list.dto';

export const generateDateCondition = (column: any, filterDate: VisitDate) => {
  let dateCondition = ``;

  if (filterDate.type === 'range' && typeof filterDate.date !== 'string') {
    dateCondition = `date(${column}) between ${filterDate.date.from} and ${filterDate.date.to}`;
  }

  if (typeof filterDate.date === 'string') {
    if (filterDate.type === 'month') {
      const [year, month] = filterDate.date.split('-');
      dateCondition = `YEAR(${column})=${year} AND MONTH(${column}) = ${month} `;
    } else if (filterDate.type === 'year') {
      dateCondition = `YEAR(${column})=${filterDate.date} `;
    } else if (filterDate.type === 'date') {
      dateCondition = `date(${column})=${filterDate.date} `;
    }
  }
  return dateCondition;
};
