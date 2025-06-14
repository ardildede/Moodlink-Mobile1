import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, interpolate } from 'react-native-reanimated';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const { width: screenWidth } = Dimensions.get('window');

interface RadarChartDataItem {
  label: string;
  value: number;
}

interface RadarChartProps {
  data: RadarChartDataItem[];
  size?: number;
  maxValue?: number;
}

export const RadarChart = ({
  data,
  size = screenWidth - 60,
  maxValue = 100,
}: RadarChartProps) => {
  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withTiming(1, { duration: 800 });
  }, [data]);

  const chartData = useMemo(() => {
    const center = size / 2;
    const radius = size * 0.28;
    const angleStep = (Math.PI * 2) / data.length;

    const labels = data.map((item, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const labelRadius = radius + 30;
      return {
        x: center + labelRadius * Math.cos(angle),
        y: center + labelRadius * Math.sin(angle),
        text: item.label,
        textAnchor: Math.abs(angle) < Math.PI / 2 ? 'start' : 'end',
      };
    });

    const grid = Array.from({ length: 5 }).map((_, i) => {
      const ringRadius = (radius / 5) * (i + 1);
      return `M ${center},${center - ringRadius} ${data.map((_, j) => {
        const angle = angleStep * j - Math.PI / 2;
        const x = center + ringRadius * Math.cos(angle);
        const y = center + ringRadius * Math.sin(angle);
        return `L ${x},${y}`;
      }).join(' ')} Z`;
    });

    const spokes = data.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      return {
        x2: center + radius * Math.cos(angle),
        y2: center + radius * Math.sin(angle),
      };
    });

    return { center, radius, angleStep, labels, grid, spokes };
  }, [data, size, maxValue]);


  const animatedProps = useAnimatedProps(() => {
    const progress = animatedProgress.value;
    const { center, radius, angleStep } = chartData;

    const points = data.map((item, i) => {
        const value = interpolate(progress, [0, 1], [0, item.value]);
        const currentRadius = (value / maxValue) * radius;
        const angle = angleStep * i - Math.PI / 2;
        const x = center + currentRadius * Math.cos(angle);
        const y = center + currentRadius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');

    return { points };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {/* Grid */}
          {chartData.grid.map((path, i) => (
            <Polygon
              key={`grid-${i}`}
              points={path.substring(2).replace(/ Z/g, '')}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Spokes */}
          {chartData.spokes.map((spoke, i) => (
            <Line
              key={`spoke-${i}`}
              x1={chartData.center}
              y1={chartData.center}
              x2={spoke.x2}
              y2={spoke.y2}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Labels */}
          {chartData.labels.map((label, i) => (
            <SvgText
              key={`label-${i}`}
              x={label.x}
              y={label.y + 5}
              fontSize="12"
              fontWeight="500"
              fill="#6b7280"
              textAnchor={
                label.x < chartData.center
                  ? 'end'
                  : label.x > chartData.center
                  ? 'start'
                  : 'middle'
              }
            >
              {label.text}
            </SvgText>
          ))}

          {/* Data Polygon */}
          <AnimatedPolygon
            animatedProps={animatedProps}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 45,
    paddingHorizontal: 25,
  },
}); 