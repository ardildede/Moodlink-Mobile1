import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';

const { width: screenWidth } = Dimensions.get('window');

interface PieChartDataItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDataItem[];
  size?: number;
}

const PieSlice = ({ slice, radius, center }) => {
  const startAngle = (slice.startPercentage / 100) * 360;
  const endAngle = startAngle + (slice.percentage / 100) * 360;
  
  const startPoint = {
    x: center + radius * Math.cos((startAngle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((startAngle - 90) * Math.PI / 180),
  };
  const endPoint = {
    x: center + radius * Math.cos((endAngle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((endAngle - 90) * Math.PI / 180),
  };

  const largeArcFlag = slice.percentage > 50 ? 1 : 0;
  const pathData = `M ${center},${center} L ${startPoint.x},${startPoint.y} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endPoint.x},${endPoint.y} Z`;

  return (
    <Path d={pathData} fill={slice.color} />
  );
};

export const PieChart = ({
  data,
  size = screenWidth * 0.8,
}: PieChartProps) => {
  const { theme } = useTheme();
  const radius = size / 2.5;
  const center = size / 2;
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;
  const slices = data.map(item => {
    const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    const sliceData = { ...item, percentage, startPercentage: cumulativePercentage };
    cumulativePercentage += percentage;
    return sliceData;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {totalValue > 0 && slices.map((slice, index) => (
            <PieSlice 
              key={index}
              slice={slice}
              radius={radius}
              center={center}
            />
          ))}
        </Svg>
      </View>
      <View style={styles.legendContainer}>
        {slices.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
}); 