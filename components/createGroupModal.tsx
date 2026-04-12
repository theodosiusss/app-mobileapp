// app/(tabs)/groupSelector.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { createGroup } from '@/features/memberService';
import GoofyButton from "@/components/goofyButton";
type CreateGroupModalProps = {
    modalVisible: boolean;
    setModalVisible:  React.Dispatch<React.SetStateAction<boolean>>;
    onPress: () => void;
};
export default function CreateGroupModal({modalVisible, setModalVisible, onPress} : CreateGroupModalProps) {
    const [newGroupName, setNewGroupName] = useState('');
    const [newPlayers, setNewPlayers] = useState('');


    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            Alert.alert('Fehler', 'Bitte gib einen Gruppennamen ein!');
            return;
        }
        const playerList = newPlayers
            .split(',')
            .map(name => name.trim())
            .filter(name => name !== "");

        if (playerList.length === 0) {
            Alert.alert('Fehler', 'Bitte gib mindestens einen Spieler ein!');
            return;
        }

        await createGroup(newGroupName, playerList);
        setModalVisible(false);
        setNewGroupName('');
        setNewPlayers('');
        Alert.alert('Erfolg', 'Gruppe wurde erstellt!');
        onPress();
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-green-500 p-2 max-w-80 mb-2 rounded-xl ml-20"
            >
                <Text className="text-white text-center font-bold text-lg">
                    + Neue Gruppe erstellen
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-3xl p-6 w-11/12">
                        <Text className="text-2xl font-bold text-pink-600 text-center mb-6">
                            Neue Gruppe
                        </Text>

                        <TextInput
                            className="border-2 text-white border-green-300  bg-blue-700 rounded-xl p-3 mb-4"
                            placeholder="Gruppenname"
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                        />

                        <TextInput
                            className="border-2 text-white border-green-300  bg-blue-700 rounded-xl p-3 mb-4"
                            placeholder="Spieler (durch Beistrich getrennt, z.B. Lena, Felix, Marie)"
                            value={newPlayers}
                            onChangeText={setNewPlayers}
                            multiline={true}
                            numberOfLines={3}
                        />

                        <View className="flex-row gap-3 justify-end">
                            <GoofyButton label="Abbrechen" onPress={() => {setModalVisible(false); onPress(); console.log(newGroupName); console.log(newPlayers)} } />
                            <GoofyButton label="Erstellen" onPress={() => handleCreateGroup()} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}