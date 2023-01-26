import { random, zip } from 'lodash';
import React, { useEffect, useState } from 'react';

import { Dimensions, StyleSheet, View } from 'react-native';
import { AwesomeLinearChart } from 'react-native-awesome-charts';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export default function App() {
  const [points, setPoints] = useState(generate());
  const transition = useSharedValue(0);
  useEffect(() => {
    const interval = setInterval(() => {
      transition.value = 0;
      setPoints(generate());
      transition.value = withTiming(1, { duration: 1000 });
    }, 2000);
    return () => clearInterval(interval);
  }, [points, transition]);
  return (
    <View style={styles.container}>
      <AwesomeLinearChart
        transition={transition}
        points={points}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height}
      />
    </View>
  );
}

function generate() {
  const now = Date.now();
  const dates = Array(10)
    .fill(0)
    .map((_, i) => now + i * 10)
    .reverse();
  const values = Array(10)
    .fill(0)
    .map((_) => random(10, 100))
    .reverse();
  return zip(values, dates) as number[][];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
