import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path as SvgPath,
  Stop,
} from 'react-native-svg';
import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import type { Path } from 'react-native-redash';
import { mixPath, serialize } from 'react-native-redash';
import buildPath from './buildPath';
import { View } from 'react-native';
import usePrevious from './usePrevious';
import { nanoid } from 'nanoid/non-secure';

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

export type LinearChartProps = {
  width: number;
  height: number;
  points: number[][];
  transition: SharedValue<number>;
};

export default function GuardLinearChart(props: LinearChartProps) {
  const { points, width, height } = props;
  const path = buildPath(points, width, height);
  if (!path) {
    return null;
  }
  return <LinearChart {...props} path={path} />;
}

export type InternalLinearChartProps = LinearChartProps & {
  path: Path;
};

function LinearChart(props: InternalLinearChartProps) {
  const { width, height, path, transition } = props;
  const previousPath = usePrevious(path);
  const animatedGradientProps = useAnimatedProps(() => {
    let d = previousPath
      ? mixPath(transition.value, previousPath, path)
      : serialize(path);
    d = `${d} L 0 ${height} L ${width} ${height}`;
    return {
      d,
    };
  }, [transition]);
  const animatedLineProps = useAnimatedProps(() => {
    const d = previousPath
      ? mixPath(transition.value, previousPath, path)
      : serialize(path);
    return {
      d: d,
    };
  }, [transition]);
  const id = nanoid();
  return (
    <View>
      <Svg
        preserveAspectRatio="none"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <Defs>
          <LinearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="10%" stopColor="red" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="blue" stopOpacity={0.3} />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          animatedProps={animatedGradientProps}
          fill={`url(#${id})`}
          strokeWidth={1}
          stroke="red"
          onPress={() => {}}
        />
        <AnimatedPath
          animatedProps={animatedLineProps}
          fill="transparent"
          stroke="red"
          strokeWidth={1}
          onPress={() => {}} //https://github.com/software-mansion/react-native-reanimated/issues/3321#issuecomment-1256983430
        />
      </Svg>
    </View>
  );
}
