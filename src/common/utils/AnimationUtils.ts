import { withSpring, withTiming } from "react-native-reanimated";

// Optimized animation configurations
export const AnimationConfig = {
  // Spring configs for better performance
  spring: {
    quick: { damping: 20, stiffness: 300 },
    smooth: { damping: 15, stiffness: 250 },
    gentle: { damping: 12, stiffness: 200 },
  },

  // Timing configs
  timing: {
    fast: { duration: 150 },
    normal: { duration: 200 },
    slow: { duration: 300 },
  },

  // Scale values
  scale: {
    press: 0.98,
    tap: 1.05,
    like: 1.15,
  },
};

// Common animation functions
export const createScaleAnimation = (
  scale: number,
  config = AnimationConfig.spring.quick
) => {
  "worklet";
  return withSpring(scale, config);
};

export const createTimingAnimation = (
  value: number,
  config = AnimationConfig.timing.normal
) => {
  "worklet";
  return withTiming(value, config);
};

// Performance optimized animation helpers
export const animateScale = (
  sharedValue: any,
  toValue = AnimationConfig.scale.tap,
  config = AnimationConfig.spring.quick
) => {
  "worklet";
  sharedValue.value = withSpring(toValue, config, () => {
    sharedValue.value = withSpring(1, config);
  });
};

export const animateOpacity = (
  sharedValue: any,
  toValue: number,
  config = AnimationConfig.timing.normal
) => {
  "worklet";
  sharedValue.value = withTiming(toValue, config);
};

export const animateTranslateY = (
  sharedValue: any,
  toValue: number,
  config = AnimationConfig.timing.normal
) => {
  "worklet";
  sharedValue.value = withTiming(toValue, config);
};
