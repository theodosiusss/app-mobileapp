// components/TrashIcon.tsx
import { Feather } from '@expo/vector-icons';

export default function TrashIcon({ color = "#EF4444", size = 24 }) {
    return <Feather name="trash-2" size={size} color={color} />;
}