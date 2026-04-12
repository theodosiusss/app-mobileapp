import {Animated, Text, View} from "react-native";
import ScrollView = Animated.ScrollView;
import GameCard from "@/components/gameCard";
import GoofyButton from "@/components/goofyButton";
import { router } from "expo-router";


export default function Index() {
    return (
        <ScrollView className="flex-1 bg-yellow-300">
            <View className="p-6 gap-6">
                <Text className="text-4xl mb-10 font-bold text-center text-pink-500">
                    Sigma Skibidi XL 67 Party Spiel App
                </Text>

                <GameCard
                    title="Lustiges Fragen Spiel"
                    color="bg-pink-400"
                    text="ayal ecken"
                    onPress={() => router.push("/questionGameMenu")}
                />
                <GoofyButton
                    label="Gruppen Bearbeiten"
                    onPress={() => router.push("/memberMenu")}
                />
                <GoofyButton label="Press me 😈" />

            </View>
        </ScrollView>
  )
}
