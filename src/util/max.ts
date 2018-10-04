export function max<T>(source: T[], p: (o: T) => number): T {
  let maxVal: number, maxObj: T;
  source.forEach(curObj => {
    const curVal = p(curObj);
    if (!maxObj) {
      maxObj = curObj; maxVal = curVal;
    } else if (curVal > maxVal) {
      maxObj = curObj;
    }
  });
  return maxObj;
}

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
