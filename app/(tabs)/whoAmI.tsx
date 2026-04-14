import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import BackButton from "@/components/backButton";
import GoofyButton from "@/components/goofyButton";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "tobi";
const STORAGE_KEY = "characters_cache";

export default function WhoAmI() {
    const [character, setCharacter] = useState("");

    useEffect(() => {
        loadGame();

        return () => {
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.DEFAULT
            );
        };
    }, []);

    const loadGame = async () => {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
        );
    };

    const loadCharacter = async () => {
        try {
            const randomPage = Math.floor(Math.random() * 5) + 1; // ~100 Leute (20 pro Seite)

            const res = await fetch(
                `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${randomPage}`
            );

            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                throw new Error("Keine Daten");
            }
            const names = data.results.map((p: any) => p.name);

            const existing = await AsyncStorage.getItem(STORAGE_KEY);

            let combined = names;

            if (existing) {
                const old = JSON.parse(existing);
                combined = [...new Set([...old, ...names])];
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(combined));

            const random =
                names[Math.floor(Math.random() * names.length)];

            setCharacter(random);

        } catch (err) {
            const cached = await AsyncStorage.getItem(STORAGE_KEY);

            if (cached) {
                const names = JSON.parse(cached);

                const random =
                    names[Math.floor(Math.random() * names.length)];

                setCharacter(random);
            } else {
                Alert.alert("Fehler", "Kein Internet und kein Cache 😢");
            }
        }
    };

    return (
        <View className="flex-1 bg-yellow-300 justify-center items-center">
            <BackButton changeScreen={true} />

            <View>
                <Text className="text-5xl mb-10 font-bold text-center text-pink-600">
                    Wer bin ich:
                </Text>

                {character ? (
                    <View>
                    <Text className="text-7xl m-5 q font-bold text-center text-cyan-600">
                        {character}
                    </Text>
                        <GoofyButton
                            onPress={loadCharacter}
                            label="Neuen Charakter Laden"
                        />
                    </View>
                ) : (
                    <GoofyButton
                        onPress={loadCharacter}
                        label="Charakter Laden"
                    />
                )}
            </View>
        </View>
    );
}