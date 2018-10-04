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
