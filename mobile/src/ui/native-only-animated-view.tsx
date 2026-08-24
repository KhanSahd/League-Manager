import { Platform, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
type AnimatedViewRef = React.ElementRef<typeof Animated.View>;

function NativeOnlyAnimatedView(
  props: (React.ComponentProps<typeof Animated.View> & React.RefAttributes<AnimatedViewRef>
    & { as?: "View" }) | (React.ComponentProps<typeof AnimatedPressable> & React.RefAttributes<View> & { as: "Pressable" })
) {
  if (Platform.OS === 'web') {
    return <>{props.children as React.ReactNode}</>;
  } else {
    if (props.as === "Pressable"){
      return <AnimatedPressable {...props} />;
    }
    return <Animated.View {...props} />;
  }
}

export { NativeOnlyAnimatedView };
