import { Pressable, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue
} from "react-native-reanimated";

type GoofyButtonProps = {
    label: string;
    disabled?: boolean;
    onPress?: () => void;
};


const colors = [
    "bg-fuchsia-300",
    "bg-blue-400",
    "bg-green-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-yellow-400",
    "bg-pink-400"
];

export default function GoofyButton({ label, onPress,disabled=false }: GoofyButtonProps) {
    const randomBetween = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const scale = useSharedValue(1);
    const rotate = useSharedValue(randomBetween(-1,1));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ]
    }));

    const handlePressIn = () => {
        scale.value = withSpring(randomBetween(0.75,1.25));
        rotate.value = withTiming(randomBetween(-2, 2), { duration: Math.random() * 200 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        rotate.value = withTiming(0, { duration: Math.random() * 300 }); // Zurück zur normalen 1deg Rotation
    };


    return (
        <Pressable
            onPress={onPress ?? (() => alert("6767676767676767"))}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                className={`${randomColor} p-4 rounded-full border-2 border-black`}
                style={[
                    { transform: [{ rotate: `${randomBetween(-1,1)}deg` }] }, // Basis Rotation
                    animatedStyle
                ]}
            >
            <Text className="text-center text-white font-bold text-lg">
                {label}
            </Text>
            </Animated.View>
        </Pressable>
    );
}