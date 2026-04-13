import { useEffect, useState, useRef } from "react";
import { View, Text, Alert, Animated, Easing } from "react-native";
import BackButton from "@/components/backButton";
import GoofyButton from "@/components/goofyButton";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { Image } from "react-native";
import {
    getCurrentGroup,
    getCurrentPlayers,
    clearCurrentGroup,
    Player
} from "@/features/memberService";

export default function KissingGame() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerA, setPlayerA] = useState<Player | null>(null);
    const [playerB, setPlayerB] = useState<Player | null>(null);
    const [kissing, setKissing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [locationUri, setLocationUri] = useState<string | null>(null);



    const scaleAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadGame();
    }, []);

    const loadGame = async () => {
        const group = await getCurrentGroup();
        if (!group) {
            Alert.alert("Fehler", "Keine Gruppe ausgewählt");
            return;
        }

        const p = await getCurrentPlayers();
        if (!p || p.length < 2) {
            Alert.alert("Fehler", "Mindestens 2 Spieler nötig");
            return;
        }

        setPlayers(p);
    };

    const pickTwoRandom = (): [Player, Player] => {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        return [shuffled[0], shuffled[1]];
    };

    const animateResult = () => {
        scaleAnim.setValue(0);
        shakeAnim.setValue(0);

        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.bounce,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const kiss = async () => {
        if (players.length < 2) return;

        scaleAnim.setValue(0);
        shakeAnim.setValue(0);

        setKissing(true);
        setShowResult(false);

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Fake "dramatic delay"
        setTimeout(async () => {
            const [a, b] = pickTwoRandom();

            const randomImage = await getRandomGalleryImage();


            setPlayerA(a);
            setPlayerB(b);
            setLocationUri(randomImage);
            setShowResult(true);

            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );

            animateResult();
            setKissing(false);
        }, 1200);
    };

    const endGame = async () => {
        await clearCurrentGroup();
        router.dismissAll();
        Alert.alert("Spiel beendet");
    };

    const shakeInterpolate = shakeAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["0deg", "10deg", "0deg"],
    });

    const getRandomGalleryImage = async (): Promise<string | null> => {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission benötigt", "Zugriff auf Fotos wurde verweigert");
            return null;
        }

        const assets = await MediaLibrary.getAssetsAsync({
            mediaType: "photo",
            first: 100,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        if (!assets.assets.length) return null;

        const randomAsset =
            assets.assets[Math.floor(Math.random() * assets.assets.length)];

        const info = await MediaLibrary.getAssetInfoAsync(randomAsset.id);

        return info.localUri || null;
    };

    return (
        <View className="flex-1 bg-yellow-300 p-4">
            <BackButton />

            <Text className="text-4xl mb-10 font-bold text-center text-pink-600">
                Küsse deine/n Homie
            </Text>

            {/* SLOT AREA */}
            <View className="flex-1 justify-center items-center">
                {showResult && playerA && playerB ? (
                    <Animated.View
                        style={{
                            transform: [
                                { scale: scaleAnim },
                                { rotate: shakeInterpolate },
                            ],
                        }}
                        className="items-center"
                    >
                        <Text className="text-2xl font-bold text-pink-700 mb-4">
                            💥 ITS A MATCH 💥
                        </Text>

                        <Text className="text-3xl font-black text-center">
                            {playerA.name}
                        </Text>

                        <Text className="text-2xl my-2">💋💋💋</Text>

                        <Text className="text-3xl font-black text-center mb-3">
                            {playerB.name}
                        </Text>
                        {locationUri && (
                            <View className="mt-4">
                                <Text className="text-center text-lg font-bold mb-2">
                                    📍 Ort des Geschehens
                                </Text>

                                <Image
                                    source={{ uri: locationUri }}
                                    className="w-64 h-40 rounded-2xl"
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </Animated.View>
                ) : (
                    <Text className="text-xl text-center text-gray-700">
                        {kissing ?"Berechnee ... " :"Drücke Nächstes Bussi 😏"}
                    </Text>
                )}
            </View>

            <View className="gap-3 mb-6">
                <GoofyButton
                    onPress={kiss}
                    disabled={kissing || players.length < 2}
                    label={kissing ? "berechnet..." : "Nächstes Bussi"}
                />

                <GoofyButton
                    onPress={endGame}
                    label="Spaß beenden"
                />
            </View>
        </View>
    );
}