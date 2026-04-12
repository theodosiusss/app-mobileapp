// app/(tabs)/groupSelector.tsx
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { loadGroups, setCurrentGroup, Group } from '@/features/memberService';
import { router } from 'expo-router';
import {Picker} from "@react-native-picker/picker";
import GoofyButton from "@/components/goofyButton";

type ChooseGroupModalType = {
    modalVisible: boolean;
    setModalVisible:  React.Dispatch<React.SetStateAction<boolean>>;
    onPress: () => void;
};

export function ChooseGroupModal({modalVisible, setModalVisible, onPress}: ChooseGroupModalType) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>();

    useEffect(() => {
        loadAllGroups();
    }, []);

    const loadAllGroups = async () => {
        const allGroups = await loadGroups();
        setGroups(allGroups);

        if (allGroups.length > 0) {
            setSelectedGroup(allGroups[0].id);
        }
    };

    const handleSelectGroup = async () => {
        if (selectedGroup) {
            await setCurrentGroup(selectedGroup);
            setModalVisible(false)
            Alert.alert('Erfolg', 'Gruppe wurde ausgewählt!');
            onPress();
        } else {
            Alert.alert('Fehler', 'Es wurde keine GRuppe gefunden');

        }

    };


    return (
        <Modal animationType="fade"
               transparent={true}
               visible={modalVisible}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <TouchableWithoutFeedback onPress={() => {
                    }}>
                        <View className="bg-black rounded-3xl p-6 w-11/12 max-w-md shadow-2xl">
                            <Text className="text-3xl font-bold text-pink-600 text-center mb-6">
                                Wähle deine Gruppe
                            </Text>
                            <Picker
                                selectedValue={selectedGroup}
                                onValueChange={(itemValue) => setSelectedGroup(itemValue)}
                            >
                                {groups.map(g => (
                                    <Picker.Item key={g.id} label={g.name} value={g.id}/>
                                ))}
                            </Picker>

                            <View className="flex-row gap-3 justify-end">
                                <GoofyButton
                                    label="Abbrechen"
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedGroup(undefined);
                                    }}
                                />
                                <GoofyButton
                                    label="Speichern"
                                    onPress={() => handleSelectGroup()}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>


        </Modal>
    );
}