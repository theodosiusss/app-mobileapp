import * as SQLite from 'expo-sqlite';

export interface Question {
    id?: number;
    text: string;
    createdAt?: string;
}

let databaseInitialized = false;
const db = SQLite.openDatabaseSync('party_questions.db');

// Initiale Party-Fragen (15 Stück)
const INITIAL_QUESTIONS: string[] = [
    "Was war dein peinlichster Moment auf einer Party?",
    "Wenn du eine Superkraft für eine Nacht hättest, welche wäre es?",
    "Was ist das Verrückteste, was du je getrunken hast?",
    "Welcher Promi sollte dein bester Freund sein?",
    "Was würdest du tun, wenn du unsichtbar wärst?",
    "Was ist die größte Lüge, die du deinen Eltern erzählt hast?",
    "Wer in diesem Raum würde am ehesten im Lotto gewinnen?",
    "Was ist dein schlimmster Date-Fail?",
    "Welchen Song hörst du heimlich, wenn niemand da ist?",
    "Was würdest du mit 1 Million Euro als erstes kaufen?",
    "Was war dein größter 'Ich-bin-zu-betrunken'-Moment?",
    "Welche drei Dinge würdest du auf eine einsame Insel mitnehmen?",
    "Was ist das Lustigste, das dir je passiert ist?",
    "Wenn du einen Tag lang ein Tier sein könntest, welches wäre es?",
    "Was ist deine guilty pleasure?"
];

// Datenbank und Tabelle erstellen
const initDatabase = async (): Promise<void> => {
    if (databaseInitialized) {
        return; // Schon initialisiert, nix tun
    }
    try {
        db.execAsync(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('Datenbank initialisiert');
        databaseInitialized = true;

        await checkAndSeedInitialQuestions();
    } catch (error) {
        console.error('Fehler beim Initialisieren der Datenbank:', error);
    }
};

const checkAndSeedInitialQuestions = async (): Promise<void> => {
    try {
        const result = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM questions;');
        const count = result[0]?.count || 0;

        if (count === 0) {
            console.log(' Keine Fragen gefunden. Füge initiale Fragen ein...');
            await seedInitialQuestions();
        } else {
            console.log(` ${count} Fragen bereits in der Datenbank vorhanden`);
        }
    } catch (error) {
        console.error(' Fehler beim Prüfen der Fragenanzahl:', error);
    }
};

const seedInitialQuestions = async (): Promise<void> => {
    try {
        for (const questionText of INITIAL_QUESTIONS) {
            await db.runAsync('INSERT INTO questions (text) VALUES (?);', questionText);
        }
        console.log(` ${INITIAL_QUESTIONS.length} initiale Fragen wurden eingefügt`);
    } catch (error) {
        console.error(' Fehler beim Einfügen der initialen Fragen:', error);
    }
};

export const getAllQuestions = async (): Promise<Question[]> => {
    try {
        await initDatabase();
        const questions = await db.getAllAsync<Question>('SELECT * FROM questions ORDER BY created_at DESC;');
        return questions;
    } catch (error) {
        console.error(' Fehler beim Abrufen der Fragen:', error);
        return [];
    }
};

export const addQuestion = async (text: string): Promise<boolean> => {
    try {
        if (!text.trim()) {
            throw new Error('Frage darf nicht leer sein');
        }

        await initDatabase();
        await db.runAsync('INSERT INTO questions (text) VALUES (?);', text.trim());
        console.log('Frage wurde hinzugefügt:', text);
        return true;
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Frage:', error);
        return false;
    }
};

export const deleteQuestion = async (id: number): Promise<boolean> => {
    try {
        await initDatabase();
        await db.runAsync('DELETE FROM questions WHERE id = ?;', id);
        console.log(`Frage mit ID ${id} wurde gelöscht`);
        return true;
    } catch (error) {
        console.error('Fehler beim Löschen der Frage:', error);
        return false;
    }
};
export const getRandomQuestion = async (): Promise<Question | null> => {
    try {
        await initDatabase();
        const questions = await db.getAllAsync<Question>('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1;');
        return questions[0] || null;
    } catch (error) {
        console.error('Fehler beim Abrufen einer zufälligen Frage:', error);
        return null;
    }
};

export const resetDatabase = async (): Promise<boolean> => {
    try {
        await db.runAsync('DELETE FROM questions;');
        await seedInitialQuestions();
        console.log('Datenbank wurde zurückgesetzt');
        return true;
    } catch (error) {
        console.error('Fehler beim Zurücksetzen der Datenbank:', error);
        return false;
    }
};