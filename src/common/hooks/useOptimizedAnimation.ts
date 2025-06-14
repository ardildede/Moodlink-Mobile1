import {
  useSharedValue,
  useAnimatedStyle,
  runOnUI,
} from "react-native-reanimated";
import { useCallback } from "react";
import { AnimationConfig, animateScale } from "../utils/AnimationUtils";

export const useOptimizedAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ] as any,
      opacity: opacity.value,
    }),
    []
  );

  const triggerScaleAnimation = useCallback(
    (scaleValue = AnimationConfig.scale.tap) => {
      runOnUI(() => {
        animateScale(scale, scaleValue);
      })();
    },
    [scale]
  );

  const triggerPressAnimation = useCallback(() => {
    triggerScaleAnimation(AnimationConfig.scale.press);
  }, [triggerScaleAnimation]);

  const triggerLikeAnimation = useCallback(() => {
    triggerScaleAnimation(AnimationConfig.scale.like);
  }, [triggerScaleAnimation]);

  const reset = useCallback(() => {
    runOnUI(() => {
      scale.value = 1;
      opacity.value = 1;
      translateY.value = 0;
    })();
  }, [scale, opacity, translateY]);

  return {
    animatedStyle,
    triggerScaleAnimation,
    triggerPressAnimation,
    triggerLikeAnimation,
    reset,
    scale,
    opacity,
    translateY,
  };
};
