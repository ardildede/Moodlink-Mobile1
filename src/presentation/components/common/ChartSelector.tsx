import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export type ChartType = 'bar' | 'pie' | 'radar';

interface ChartOption {
  type: ChartType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface ChartSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  theme: any;
}

const chartOptions: ChartOption[] = [
  {
    type: 'pie',
    label: 'Pasta',
    icon: 'pie-chart-outline',
    description: 'Oranları gösterir',
  },
  {
    type: 'radar',
    label: 'Radar',
    icon: 'radio-outline',
    description: 'Çok boyutlu görünüm',
  },
];

export const ChartSelector: React.FC<ChartSelectorProps> = ({
  selectedType,
  onTypeChange,
  theme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>
        Grafik Türü
      </Text>
      
      <View style={styles.optionsContainer}>
        {chartOptions.map((option) => (
          <ChartOptionButton
            key={option.type}
            option={option}
            isSelected={selectedType === option.type}
            onPress={() => onTypeChange(option.type)}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
};

interface ChartOptionButtonProps {
  option: ChartOption;
  isSelected: boolean;
  onPress: () => void;
  theme: any;
}

const ChartOptionButton: React.FC<ChartOptionButtonProps> = ({
  option,
  isSelected,
  onPress,
  theme,
}) => {
  const scale = useSharedValue(1);
  const animatedBackgroundOpacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    animatedBackgroundOpacity.value = withTiming(isSelected ? 1 : 0, {
      duration: 200,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: animatedBackgroundOpacity.value,
  }));

  const handlePress = () => {
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handlePress}
      style={[styles.optionButton, { borderColor: theme.border }]}
    >
      <Animated.View style={animatedStyle}>
        {/* Background gradient for selected state */}
        <Animated.View style={[styles.selectedBackground, animatedBackgroundStyle]}>
          <LinearGradient
            colors={[theme.primary, theme.ring]}
            style={styles.gradientBackground}
          />
        </Animated.View>

        {/* Content */}
        <View style={styles.buttonContent}>
          <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
            <Ionicons
              name={option.icon}
              size={24}
              color={isSelected ? 'white' : theme.mutedForeground}
            />
          </View>
          
          <Text style={[
            styles.optionLabel,
            { color: isSelected ? 'white' : theme.foreground },
            isSelected && styles.selectedLabel
          ]}>
            {option.label}
          </Text>
          
          <Text style={[
            styles.optionDescription,
            { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.mutedForeground },
            isSelected && styles.selectedDescription
          ]}>
            {option.description}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  buttonContent: {
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedLabel: {
    color: 'white',
  },
  optionDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedDescription: {
    color: 'rgba(255,255,255,0.8)',
  },
}); 