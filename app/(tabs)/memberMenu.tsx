import { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert, SectionList } from "react-native";
import BackButton from "@/components/backButton";
import TrashIcon from "@/components/trashicon";
import {
    deleteGroup,
    Group,
    loadGroups,
    removePlayerFromGroup
} from "@/features/memberService";
import CreateGroupModal from "@/components/createGroupModal";
import GoofyButton from "@/components/goofyButton";
import AddPlayerModal from "@/components/addPlayerModal";

const MemberMenu = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [playerModalVisible, setPlayerModalVisible] = useState({
        state: false,
        id: ""
    });
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllGroups();
    }, []);

    const loadAllGroups = async () => {
        setLoading(true);
        const allGroups = await loadGroups();
        setGroups(allGroups);
        setLoading(false);
    };

    const sections = useMemo(
        () =>
            groups.map((g, index) => ({
                title: { g, index },
                data: g.players
            })),
        [groups]
    );

    const handleDeleteGroup = async (id: string, groupName: string) => {
        Alert.alert(
            "Gruppe löschen",
            `Möchtest du wirklich "${groupName}" löschen?`,
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    onPress: async () => {
                        await deleteGroup(id);
                        await loadAllGroups();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleDeletePlayer = async (
        groupId: string,
        playerName: string
    ) => {
        Alert.alert(
            "Spieler löschen",
            `Möchtest du wirklich "${playerName}" löschen?`,
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    onPress: async () => {
                        await removePlayerFromGroup(groupId, playerName);
                        await loadAllGroups();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-yellow-300 justify-center items-center">
                <Text className="text-xl text-pink-600">
                    Lade Gruppen...
                </Text>
            </View>
        );
    }

    if (groups.length === 0) {
        return (
            <View className="flex-1 bg-yellow-300">
                <BackButton />

                <CreateGroupModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    onPress={loadAllGroups}
                />

                <View className="flex-1 justify-center items-center">
                    <Text className="text-xl text-pink-600">
                        Noch keine Gruppen vorhanden
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-yellow-300">
            <BackButton />

            <CreateGroupModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onPress={loadAllGroups}
            />

            <SectionList
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                sections={sections}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}

                renderSectionHeader={({ section }) => (
                    <View className="mb-3 mt-4">

                        {/* GROUP CARD */}
                        <View className="bg-blue-300 rounded-2xl p-4 flex-row justify-between items-center border border-lime-600">
                            <View className="flex-1 mr-3">
                                <Text className="text-lg font-semibold text-gray-800">
                                    {section.title.index + 1}.{" "}
                                    {section.title.g.name}
                                </Text>

                                {section.title.g.createdAt && (
                                    <Text className="text-gray-400 text-xs mt-1">
                                        {new Date(
                                            section.title.g.createdAt
                                        ).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() =>
                                    handleDeleteGroup(
                                        section.title.g.id,
                                        section.title.g.name
                                    )
                                }
                                className="bg-red-100 p-2 rounded-full"
                            >
                                <TrashIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                renderItem={({ section, item, index }) => (
                    <View className="ml-4 mb-2">

                        {/* PLAYER */}
                        <View className="bg-emerald-500 rounded-xl p-3 flex-row justify-between items-center border border-blue-200">
                            <Text className="text-gray-800">
                                {index + 1}. {item.name}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    handleDeletePlayer(
                                        section.title.g.id,
                                        item.name
                                    )
                                }
                                className="bg-red-100 p-2 rounded-full"
                            >
                                <TrashIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                renderSectionFooter={({ section }) => (
                    <View className="ml-6 mb-5">
                        <GoofyButton
                            label="Spieler hinzufügen"
                            onPress={() =>
                                setPlayerModalVisible({
                                    state: true,
                                    id: section.title.g.id
                                })
                            }
                        />
                    </View>
                )}
            />

            <AddPlayerModal
                modalVisible={playerModalVisible}
                setModalVisible={setPlayerModalVisible}
                onPress={loadAllGroups}
            />
        </View>
    );
};

export default MemberMenu;