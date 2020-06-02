export type Filter = {[key: string]: unknown};

export const matchAppData = (appData: Filter, filter: Filter): boolean => {
  for (const filterKey in filter) {
    if (filter[filterKey] !== appData[filterKey]) return false;
  }

  return true;
};
