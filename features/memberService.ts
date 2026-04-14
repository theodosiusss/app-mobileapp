import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Player {
    name: string;
}

export interface Group {
    id: string;
    name: string;
    players: Player[];
    createdAt: string;
    lastPlayed?: string;
}

const GROUPS_STORAGE_KEY = '@party_groups';
const CURRENT_GROUP_KEY = '@current_group';

// Alle Gruppen laden
export const loadGroups = async (): Promise<Group[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(GROUPS_STORAGE_KEY)|| "[]";
        const groups = JSON.parse(jsonValue);
        console.log(`${groups.length} Gruppen geladen`);
        return groups;
    } catch (error) {
        console.error('Fehler beim Laden der Gruppen:', error);
        return [];
    }
};

// Alle Gruppen speichern
export const saveGroups = async (groups: Group[]): Promise<boolean> => {
    try {
        const jsonValue = JSON.stringify(groups);
        await AsyncStorage.setItem(GROUPS_STORAGE_KEY, jsonValue);
        console.log('Gruppen wurden gespeichert');
        return true;
    } catch (error) {
        console.error('Fehler beim Speichern der Gruppen:', error);
        return false;
    }
};

export const createGroup = async (groupName: string, playerNames: string[]): Promise<Group | null> => {
    try {
        const groups = await loadGroups();
        const newGroup: Group = {
            id: Date.now().toString(),
            name: groupName.trim(),
            players: playerNames.map((name, index) => ({
                id: Date.now().toString() + index,
                name: name.trim()
            })),
            createdAt: new Date().toISOString(),
        };

        groups.push(newGroup);
        await saveGroups(groups);
        console.log(`Gruppe "${groupName}" wurde erstellt mit ${playerNames.length} Spielern`);
        return newGroup;
    } catch (error) {
        console.error('Fehler beim Erstellen der Gruppe:', error);
        return null;
    }
};

export const deleteGroup = async (groupId: string): Promise<boolean> => {
    try {
        const groups = await loadGroups();
        const filteredGroups = groups.filter(group => group.id !== groupId);
        await saveGroups(filteredGroups);

        const currentGroup = await getCurrentGroup();
        if (currentGroup?.id === groupId) {
            await clearCurrentGroup();
        }
        console.log(`Gruppe mit ID ${groupId} wurde gelöscht`);
        return true;
    } catch (error) {
        console.error('Fehler beim Löschen der Gruppe:', error);
        return false;
    }
};

// Spieler zu Gruppe hinzufügen
export const addPlayerToGroup = async (groupId: string, playerName: string): Promise<boolean> => {
    try {
        const groups = await loadGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            throw new Error('Gruppe nicht gefunden');
        }

        const newPlayer: Player = {
            name: playerName.trim()
        };

        group.players.push(newPlayer);
        await saveGroups(groups);
        console.log(`Spieler "${playerName}" zu Gruppe "${group.name}" hinzugefügt`);
        return true;
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Spielers:', error);
        return false;
    }
};

// Spieler aus Gruppe entfernen
export const removePlayerFromGroup = async (groupId: string, playerName: string): Promise<boolean> => {
    try {
        const groups = await loadGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            throw new Error('Gruppe nicht gefunden');
        }

        group.players = group.players.filter(player => player.name !== playerName);
        await saveGroups(groups);
        console.log(`Spieler wurde aus Gruppe "${group.name}" entfernt`);
        if(group.players.length === 0){
            await deleteGroup(group.id);
        }
        return true;
    } catch (error) {
        console.error('Fehler beim Entfernen des Spielers:', error);
        return false;
    }
};

export const setCurrentGroup = async (groupId: string): Promise<boolean> => {
    try {
        const groups = await loadGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            throw new Error('Gruppe nicht gefunden');
        }

        // Letztes Spiel-Datum aktualisieren
        group.lastPlayed = new Date().toISOString();
        await saveGroups(groups);

        // Aktuelle Gruppe speichern
        await AsyncStorage.setItem(CURRENT_GROUP_KEY, groupId);
        console.log(`Aktuelle Gruppe ist jetzt: "${group.name}"`);
        return true;
    } catch (error) {
        console.error('Fehler beim Setzen der aktuellen Gruppe:', error);
        return false;
    }
};

export const getCurrentGroup = async (): Promise<Group | null> => {
    try {
        const groupId = await AsyncStorage.getItem(CURRENT_GROUP_KEY);
        if (!groupId) return null;

        const groups = await loadGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            await clearCurrentGroup();
            return null;
        }

        return group;
    } catch (error) {
        console.error('Fehler beim Laden der aktuellen Gruppe:', error);
        return null;
    }
};

export const clearCurrentGroup = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CURRENT_GROUP_KEY);
        console.log('Aktuelle Gruppe wurde zurückgesetzt');
    } catch (error) {
        console.error('Fehler beim Zurücksetzen der aktuellen Gruppe:', error);
    }
};

// Alle Spieler der aktuellen Gruppe laden
export const getCurrentPlayers = async (): Promise<Player[]> => {
    const currentGroup = await getCurrentGroup();
    return currentGroup?.players || [];
};

export const resetAllGroups = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(GROUPS_STORAGE_KEY);
        await AsyncStorage.removeItem(CURRENT_GROUP_KEY);
        console.log('🔄 Alle Gruppen wurden zurückgesetzt');
        return true;
    } catch (error) {
        console.error('Fehler beim Zurücksetzen aller Gruppen:', error);
        return false;
    }
};