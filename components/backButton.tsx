import {Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

type Props = {
    changeScreen?: boolean;
};
export default function BackButton({changeScreen
} : Props) {

    return (
        <View className="p-4">
            <TouchableOpacity
                onPress={() => {router.back();
                    if(changeScreen){
                        ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.DEFAULT)
                    }
                }}
                className="bg-lime-300 p-3 rounded-xl self-start"
            >
                <Text className="text-white font-bold">← Zurück</Text>
            </TouchableOpacity>
        </View>
    )
}