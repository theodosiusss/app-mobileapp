import {Modal, TextInput, TouchableWithoutFeedback, View,Text} from "react-native";
import GoofyButton from "@/components/goofyButton";

type QuestionModalProps = {
    modalVisible: boolean;
    setModalVisible:  React.Dispatch<React.SetStateAction<boolean>>;
    question: string;
    setQuestion: React.Dispatch<React.SetStateAction<string>>;
    onPress: () => void;
};

export default function CreateQuestionModal({modalVisible, setModalVisible,question,setQuestion,onPress}: QuestionModalProps) {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View className="bg-white rounded-3xl p-6 w-11/12 max-w-md shadow-2xl">
                            <Text className="text-2xl font-bold text-center text-pink-600 mb-6">
                                Neue Frage hinzufügen
                            </Text>
                            <TextInput
                                className="border-2 border-gray-300 rounded-xl p-3 mb-4 text-base"
                                placeholder="67?"
                                placeholderTextColor="#999"
                                value={question}
                                onChangeText={setQuestion}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                            <View className="flex-row gap-3 justify-end">
                                <GoofyButton
                                    label="Abbrechen"
                                    onPress={() => {
                                        console.log(question)
                                        setModalVisible(false);
                                        setQuestion("");
                                    }}
                                />
                                <GoofyButton
                                    label="Speichern"
                                    onPress={onPress}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}