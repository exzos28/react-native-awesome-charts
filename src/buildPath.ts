import { parse, Path } from 'react-native-redash';
import { curveBumpX, line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

export default function buildPath(
  points: number[][],
  width: number,
  height: number
): Path | undefined {
  const xValues = points.map((value) => value[0]!);
  const yValues = points.map((value) => value[1]!);
  const minPrice = Math.min(...xValues);
  const maxPrice = Math.max(...xValues);
  const fromDate = Math.min(...yValues);
  const toDate = Math.max(...yValues);
  return parse(
    line()
      .x(
        ([, x]) =>
          scaleLinear().domain([fromDate, toDate]).range([0, width])(
            x
          ) as number
      )
      .y(
        ([y]) =>
          scaleLinear().domain([minPrice, maxPrice]).range([height, 0])(
            y
          ) as number
      )
      .curve(curveBumpX)(points as [number, number][]) as string
  );
}
