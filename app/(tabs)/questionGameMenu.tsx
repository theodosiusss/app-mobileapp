import {Animated, Text, TouchableOpacity, View, Modal, Alert, TextInput, TouchableWithoutFeedback} from "react-native";
import ScrollView = Animated.ScrollView;
import GoofyButton from "@/components/goofyButton";
import {router} from "expo-router";
import {useState} from "react";
import CreateQuestionModal from "@/components/createQuestionModal";
import {addQuestion} from "@/features/questionService";
import {Background} from "@react-navigation/elements";
import BackButton from "@/components/backButton";
import {ChooseGroupModal} from "@/components/chooseGroupModal";
import {getCurrentGroup} from "@/features/memberService";

export default function QuestionMembersGame() {
    const [modalVisible, setModalVisible] = useState(false);
    const [groupModalVisible, setGroupModalVisible] = useState(false);

    const [question, setQuestion] = useState("");


    const handleAddQuestion = async () => {
        if (question.trim() === "") {
            Alert.alert("Fehler", "Bitte fülle die Frage aus du Goofy!!");
            return;
        }

        const success = await addQuestion(question);

        if (success) {
            Alert.alert("Erfolg", "Frage wurde hinzugefügt!");
            setModalVisible(false);
            setQuestion("");
        } else {
            Alert.alert("Fehler", "Frage konnte nicht gespeichert werden!");
        }

        setModalVisible(false);
        setQuestion("");
    };

    const startgame = async () => {
        const currentGroup = await getCurrentGroup();
        if(!currentGroup) {
            Alert.alert("Spiel Konnte nicht gestartet werden (Keine Gruppe gefunden)");
            return;
        }
        if(currentGroup.players.length === 0){
            Alert.alert("Spiel Konnte nicht gestartet werden (Keine Spieler*innen in der Gruppe gefunden)");
            return;
        }
        router.push("/questionGame");
    }

    return (
        <ScrollView className="flex-1 bg-yellow-300">
            <BackButton />
            <View className="p-6 gap-6">
                <Text className="text-4xl mb-10 font-bold text-center text-pink-600">
                    Das Unglaublich Tolle Fragen Spiel
                </Text>

                <GoofyButton
                    label="Fragenübersicht"
                    onPress={() => router.push("/questionManager")}
                />
                <GoofyButton label="Neue Fragen Hinzufügen" onPress={() => setModalVisible(true)}/>
                <GoofyButton
                    label="Spiel Starten"
                    onPress={() => setGroupModalVisible(true)}
                />
            </View>

            <CreateQuestionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                question={question}
                setQuestion={setQuestion}
                onPress={handleAddQuestion}/>

            <ChooseGroupModal modalVisible={groupModalVisible} setModalVisible={setGroupModalVisible} onPress={() =>startgame()} />

        </ScrollView>
    );
}