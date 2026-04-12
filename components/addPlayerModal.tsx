import {Modal, TextInput, TouchableWithoutFeedback, View, Text, Alert} from "react-native";
import GoofyButton from "@/components/goofyButton";
import {useState} from "react";
import {addPlayerToGroup} from "@/features/memberService";

type PlayerModalProps = {
    modalVisible:  {state: boolean, id: string };
    setModalVisible:   React.Dispatch<React.SetStateAction<{
        state: boolean
        id: string
    }>>
    ;
    onPress: () => void;
};

export default function AddPlayerModal({modalVisible, setModalVisible, onPress}: PlayerModalProps) {
    const [player, setPlayer] = useState("");

    async function  handleSave  (){
        await addPlayerToGroup(modalVisible.id, player);
        setPlayer("");
        setModalVisible({state: false, id: ""});
        Alert.alert('Erfolg', 'Spieler*in wurde hinzugefügt!');
        onPress();


    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible.state}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible({state: false, id: ""})}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View className="bg-white rounded-3xl p-6 w-11/12 max-w-md shadow-2xl">
                            <Text className="text-2xl font-bold text-center text-pink-600 mb-6">
                                Neue/n Spieler*in hinzufügen
                            </Text>
                            <TextInput
                                className="border-2 border-gray-300 rounded-xl p-3 mb-4 text-base"
                                placeholder="Sigmalord"
                                placeholderTextColor="#999"
                                value={player}
                                onChangeText={setPlayer}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                            <View className="flex-row gap-3 justify-end">
                                <GoofyButton
                                    label="Abbrechen"
                                    onPress={() => {
                                        console.log(player)
                                        setModalVisible({state: false, id: ""});
                                        setPlayer("");
                                    }}
                                />
                                <GoofyButton
                                    label="Speichern"
                                    onPress={handleSave}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}