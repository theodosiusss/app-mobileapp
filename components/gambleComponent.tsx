import { Text, View } from "react-native";
import { useRef } from "react";

type GamblePRops = {
    currentPlayer: string | null;
    currentQuestion: string | null;
};

const colors = [
    "bg-fuchsia-300",
    "bg-blue-400",
    "bg-green-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-orange-400",
    "bg-indigo-400",
    "bg-emerald-400",
    "bg-cyan-400",
    "bg-lime-400",
    "bg-teal-400",
    "bg-rose-400",
    "bg-violet-400",
    "bg-sky-400",
    "bg-amber-400",
    "bg-slate-300",
    "bg-emerald-300",
    "bg-pink-300"
];

export default function GambleComponent({
                                            currentPlayer = "Bereit?",
                                            currentQuestion = "Drücke Start!"
                                        }: GamblePRops) {

    const bgColor =
        colors[Math.floor(Math.random() * colors.length)]


    return (
        <View className={`flex-1 justify-center items-center min-w-full border-4 rounded-3xl mb-5 border-blue-500 ${bgColor}`}>
            <Text className="text-2xl font-bold text-pink-600 text-center mb-4">
                {currentPlayer || "Bereit?"}
            </Text>

            <Text className="text-lg text-gray-800 text-center px-4">
                {currentQuestion || "Drücke Start!"}
            </Text>
        </View>
    );
}