import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home } from "./pages";

const App = () => {
	return (
		<NativeBaseProvider colorModeManager={colorModeManager}>
			<Box flex={1}>
				<Home />
				<StatusBar style="auto" />
			</Box>
		</NativeBaseProvider>
	);
};

export default App;

const colorModeManager: StorageManager = {
	get: async () => {
		try {
			let val = await AsyncStorage.getItem("@color-mode");
			return val === "dark" ? "dark" : "light";
		} catch (e) {
			return "light";
		}
	},
	set: async (value: ColorMode) => {
		try {
			await AsyncStorage.setItem("@color-mode", value);
		} catch (e) {
			console.log(e);
		}
	},
};
