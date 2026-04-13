import {Animated, Text, View, Alert} from "react-native";
import ScrollView = Animated.ScrollView;
import GoofyButton from "@/components/goofyButton";
import {router} from "expo-router";
import {useState} from "react";
import BackButton from "@/components/backButton";
import {ChooseGroupModal} from "@/components/chooseGroupModal";
import {getCurrentGroup} from "@/features/memberService";
import * as MediaLibrary from "expo-media-library";

export default function KissingGameMenu() {
    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [permission, requestPermission] = MediaLibrary.usePermissions();
    const requestGalleryAccess = async () => {
        const result = await requestPermission();
        if (result.granted) {
            Alert.alert("Danke!", "Zugriff auf Fotos erlaubt 🎉");
        } else {
            Alert.alert(
                "Keine Berechtigung",
                "Ohne Zugriff auf Fotos funktioniert das Feature nicht 😢"
            );
        }
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
        router.push("/kissingGame");
    }

    return (
        <ScrollView className="flex-1 bg-yellow-300">
            <BackButton />
            <View className="p-6 gap-6">
                <Text className="text-4xl mb-10 font-bold text-center text-pink-600">
                    Das Unglaubliche Kuss Spiel 🫦🫦🫦
                </Text>
                {permission?.granted === false ? (
                    <GoofyButton
                        onPress={requestGalleryAccess}
                        label="Fotos Zugriff erlauben"
                    />
                ): ""}


                <GoofyButton
                    label="Spiel Starten"
                    onPress={() => setGroupModalVisible(true)}
                />
            </View>


            <ChooseGroupModal modalVisible={groupModalVisible} setModalVisible={setGroupModalVisible} onPress={() =>startgame()} />

        </ScrollView>
    );
}