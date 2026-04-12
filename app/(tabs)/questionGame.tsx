import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Alert,
    Easing
} from "react-native";
import BackButton from "@/components/backButton";

import {
    getCurrentGroup,
    getCurrentPlayers,
    clearCurrentGroup,
    Player
} from "@/features/memberService";

import {
    getAllQuestions, getRandomQuestion,
    Question
} from "@/features/questionService";

import * as Haptics from "expo-haptics";
import GoofyButton from "@/components/goofyButton";
import {router} from "expo-router";
import GambleComponent from "@/components/gambleComponent";

export default function QuestionGame() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [usedQuestions, setUsedQuestions] = useState<number[]>([]);

    const [currentPlayer, setCurrentPlayer] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState("");

    const [spinning, setSpinning] = useState(false);
    const [allQDone, setAllQDone] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadGame();
    }, []);

    const hasAutoStarted = useRef(false);

    useEffect(() => {
        if (
            !hasAutoStarted.current &&
            players.length > 0 &&
            questions.length > 0
        ) {
            hasAutoStarted.current = true;
            spin();
        }
    }, [players, questions]);

    const loadGame = async () => {
        setLoading(true);

        const group = await getCurrentGroup();
        if (!group) {
            Alert.alert("Fehler", "Keine Gruppe ausgewählt");
            setLoading(false);
            return;
        }

        const p = await getCurrentPlayers();
        const q = await getAllQuestions();

        if (p.length === 0) {
            Alert.alert("Fehler", "Keine Spieler vorhanden");
            setLoading(false);
            return;
        }

        setPlayers(p);
        setQuestions(q);

        setLoading(false);


    };

    const getRandomUnusedQuestion = () => {
        const available = questions.filter(
            q => !usedQuestions.includes(q.id!)
        );

        if (available.length === 0) {
            return null;
        }

        const q =
            available[Math.floor(Math.random() * available.length)];

        setUsedQuestions(prev => [...prev, q.id!]);

        return q;
    };
    const spin = async () => {
        if (spinning) return;

        const question = getRandomUnusedQuestion();

        if (!question) {
            setCurrentPlayer("🎉 Fertig!");
            setCurrentQuestion("Alle Fragen wurden gespielt!");
            setAllQDone(true);
            return;
        }

        setSpinning(true);
        setCurrentPlayer("");
        setCurrentQuestion("");

        let interval: NodeJS.Timeout;

        interval = setInterval(async () => {
            const randomPlayer =
                players[Math.floor(Math.random() * players.length)];

            const randomQuestion = await getRandomQuestion();

            setCurrentPlayer(randomPlayer.name);
            setCurrentQuestion(randomQuestion?.text || "");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 50);

        // Stop nach 2 Sekunden
        setTimeout(() => {
            clearInterval(interval);
            setSpinning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // finale Auswahl (damit sicher konsistent)
            finalizeRound(question);
        }, 2000);
    };

    const finalizeRound = async (finalquestion : Question ) => {
        const randomPlayer =
            players[Math.floor(Math.random() * players.length)];

        const randomQuestion = finalquestion;

        setCurrentPlayer(randomPlayer.name);
        setCurrentQuestion(randomQuestion?.text || "");

    };


    const endGame = async () => {
        await clearCurrentGroup();
        router.dismissAll();
        Alert.alert("Spiel beendet");
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-yellow-300">
                <Text>Lade Spiel...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-yellow-300 p-4">
            <BackButton />

            <Text className="text-4xl mb-10 font-bold text-center text-pink-600">
                Beantworte die Frage 😈😈😈😈😈😈😈😈😈😈😈
            </Text>

            {/* SLOT AREA */}
            <View className="flex-1 justify-center items-center">

                    <GambleComponent currentPlayer={currentPlayer} currentQuestion={currentQuestion} />
            </View>

            {/* BUTTONS */}
            <View className="gap-3 mb-6">

                <GoofyButton
                    onPress={spin}
                    disabled={spinning || allQDone}
                    label={allQDone? "Fertig " : spinning ? "Dreht..." : "Nächste Runde"}
                />

                <GoofyButton
                    onPress={endGame}
                    label="Spiel beenden"
                />
            </View>
        </View>
    );
}