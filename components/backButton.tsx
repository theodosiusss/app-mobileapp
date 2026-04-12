import {Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";

export default function BackButton() {
    return (
        <View className="p-4">
            <TouchableOpacity
                onPress={() => router.back()}
                className="bg-lime-300 p-3 rounded-xl self-start"
            >
                <Text className="text-white font-bold">← Zurück</Text>
            </TouchableOpacity>
        </View>
    )
}