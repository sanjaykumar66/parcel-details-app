export const parseCSV = (csvString: string) => {
    const rows = csvString.split('\n')
    let headers = rows.shift()?.split(',')
    headers = headers?.map((header) => header.trim().replace(/ /g, '_'))
    const result = rows.map((row) => {
      const values = row.split(',')
      return headers?.reduce((acc, header, index) => {
        acc[header] = values[index].trim()
        if(header === 'date'){
            if (typeof acc[header] === 'string' || typeof acc[header] === 'number') {
              //  timestamp = new Date(acc[header]).getTime();
            } else {
                console.error('Invalid date format:', acc[header]);
            }
        }
        return acc
      }, {} as { [key: string]: string })
    })
  
    return result
}

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}