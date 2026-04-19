import type { AppEvent } from '../App';

const months = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

export function filterEventsByText(events: AppEvent[], searchText: string): AppEvent[] {
  if (!searchText || searchText.trim() === '') return events;
  const text = searchText.toLowerCase();
  return events.filter(event => {
    const inTitle = event.title.toLowerCase().includes(text);
    const inDesc = event.description?.toLowerCase().includes(text);
    const inCats = event.categories?.toLowerCase().includes(text);
    let inDate = false;
    if (event.dateFrom) {
      const dateFrom = event.dateFrom.toLowerCase();
      inDate = dateFrom.includes(text);
      months.forEach((m, idx) => {
        if (text === m && dateFrom.includes((idx+1).toString().padStart(2,'0'))) inDate = true;
      });
    }
    if (event.dateTo && !inDate) {
      const dateTo = event.dateTo.toLowerCase();
      inDate = dateTo.includes(text);
      months.forEach((m, idx) => {
        if (text === m && dateTo.includes((idx+1).toString().padStart(2,'0'))) inDate = true;
      });
    }
    return inTitle || inDesc || inCats || inDate;
  });
}
