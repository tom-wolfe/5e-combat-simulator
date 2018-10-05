export function min<T>(source: T[], p: (o: T) => number): T {
  let minValue: number, minObj: T;
  source.forEach(curObj => {
    const curVal = p(curObj);
    if (!minObj) {
      minObj = curObj; minValue = curVal;
    } else if (curVal < minValue) {
      minObj = curObj;
    }
  });
  return minObj;
}
