import { Text, TouchableOpacity } from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue
} from "react-native-reanimated";

type GameCardProps = {
    title: string;
    color: string;
    text: string;
    onPress?: () => void;
};

export default function GameCard({ title, color, text, onPress }: GameCardProps) {
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ]
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
        rotate.value = withTiming(2, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        rotate.value = withTiming(1, { duration: 200 }); // Zurück zur normalen 1deg Rotation
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View
                className={`${color} p-6 rounded-3xl shadow-xl ${!!onPress ? "border-4 border-blue-500": "border-4 border-dashed border-black"} `}
                style={[
                    { transform: [{ rotate: "1deg" }] }, // Basis Rotation
                    animatedStyle
                ]}
            >
                <Text className="text-xl font-extrabold text-white">
                    {title}
                </Text>
                <Text className="text-white mt-2">
                    {text}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}