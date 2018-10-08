export function min<T>(source: T[], p: (o: T) => number): { object: T, value: number } {
  let minValue: number, minObj: T;
  source.forEach(curObj => {
    const curVal = p(curObj);
    if (!minObj) {
      minObj = curObj; minValue = curVal;
    } else if (curVal < minValue) {
      minObj = curObj;
    }
  });
  return { object: minObj, value: minValue };
}
