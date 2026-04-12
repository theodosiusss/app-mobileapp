import { useEffect, useState } from "react";
import { deleteQuestion, getAllQuestions, Question } from "@/features/questionService";
import {View, Text, TouchableOpacity, Alert, Animated} from "react-native";
import BackButton from "@/components/backButton";
import TrashIcon from "@/components/trashicon";
import ScrollView = Animated.ScrollView; // Passe den Pfad an

const AdminQuestionManager = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        const allQuestions = await getAllQuestions();
        setQuestions(allQuestions);
        setLoading(false);
    };

    const handleDelete = async (id: number, questionText: string) => {
        Alert.alert(
            "Frage löschen",
            `Möchtest du wirklich "${questionText}" löschen?`,
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    onPress: async () => {
                        await deleteQuestion(id);
                        await loadQuestions();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-yellow-300 justify-center items-center">
                <Text className="text-xl text-pink-600">Lade Fragen...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-yellow-300">
            <View className="p-4">
                <BackButton />
            </View>

            <View className="flex-1 px-4">
                <Text className="text-2xl font-bold text-pink-600 mb-4 text-center">
                    Fragen verwalten ({questions.length})
                </Text>

                {questions.length === 0 ? (
                    <Text className="text-center text-gray-600 mt-10">
                        Keine Fragen vorhanden. Füge welche hinzu!
                    </Text>
                ) : (
                    <View className="gap-3">
                        {questions.map((q, index) => (
                            <View
                                key={q.id}
                                className="bg-blue-300 rounded-xl p-4 flex-row justify-between items-center shadow-sm"
                            >
                                <View className="flex-1 mr-3">
                                    <Text className="text-gray-800 text-base">
                                        {index + 1}. {q.text}
                                    </Text>
                                    {q.createdAt && (
                                        <Text className="text-gray-400 text-xs mt-1">
                                            {new Date(q.createdAt).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleDelete(q.id!, q.text)}
                                    className="bg-red-100 p-3 rounded-full active:opacity-70"
                                >
                                    <TrashIcon />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default AdminQuestionManager;