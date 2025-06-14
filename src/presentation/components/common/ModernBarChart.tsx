import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, interpolate } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface BarChartDataItem {
  label: string;
  value: number;
  color: string;
}

interface ModernBarChartProps {
  data: BarChartDataItem[];
  height?: number;
  onBarPress?: (item: BarChartDataItem) => void;
}

const BAR_AREA_HEIGHT = 200;
const Y_AXIS_WIDTH = 40;
const X_AXIS_HEIGHT = 40;

export const ModernBarChart = ({ data, height = 280, onBarPress }: ModernBarChartProps) => {
  const maxValue = 100; // Assuming scores are out of 100

  return (
    <View style={[styles.container, { height }]}>
      {/* Y-Axis Grid Lines */}
      <View style={styles.yAxisContainer}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>

      {/* Bars */}
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const animatedValue = useSharedValue(0);
          React.useEffect(() => {
            animatedValue.value = withDelay(index * 50, withTiming(item.value, { duration: 500 }));
          }, [item.value]);

          const animatedBarStyle = useAnimatedStyle(() => {
            const barHeight = interpolate(
              animatedValue.value,
              [0, maxValue],
              [0, BAR_AREA_HEIGHT]
            );
            return { height: barHeight };
          });
          
          const animatedLabelStyle = useAnimatedStyle(() => {
            const opacity = interpolate(animatedValue.value, [0, 20], [0, 1]);
            return { opacity };
          });

          return (
            <TouchableOpacity
              key={index}
              style={styles.barWrapper}
              onPress={() => onBarPress?.(item)}
              activeOpacity={0.6}
            >
              <View style={styles.barContent}>
                <Animated.View style={[styles.valueContainer, animatedLabelStyle]}>
                  <Text style={styles.valueText}>{Math.round(item.value)}</Text>
                </Animated.View>
                <Animated.View style={[styles.bar, animatedBarStyle]}>
                  <LinearGradient
                    colors={[item.color, `${item.color}99`]}
                    style={styles.gradient}
                  />
                </Animated.View>
                <Text style={styles.labelText} numberOfLines={2}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  yAxisContainer: {
    width: Y_AXIS_WIDTH,
    height: BAR_AREA_HEIGHT,
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    top: 20, // To align with top of bars
  },
  gridLine: {
    width: screenWidth - 32, // Full width
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginLeft: Y_AXIS_WIDTH,
    height: BAR_AREA_HEIGHT + X_AXIS_HEIGHT
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barContent: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  valueContainer: {
    position: 'absolute',
    top: -20
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  labelText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    height: X_AXIS_HEIGHT - 10,
  },
}); 