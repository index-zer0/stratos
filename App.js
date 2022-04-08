import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Platform } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdMobInterstitial } from "expo-ads-admob";
import { Home } from "./pages";
import { AD_UNIT_ID } from "@env";

const showInterstitial = async () => {
	await AdMobInterstitial.setAdUnitID(
		__DEV__ ? "ca-app-pub-3940256099942544/1033173712" : AD_UNIT_ID
	);
	await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
	await AdMobInterstitial.showAdAsync();
};

const isNumeric = (value) => {
	return /^-?\d+$/.test(value);
};

const App = () => {
	React.useEffect(async () => {
		let val = await AsyncStorage.getItem("@ad-counter");
		if (isNumeric(val)) {
			val = parseInt(val);
			if (val >= 3) {
				AsyncStorage.setItem("@ad-counter", "0");
				showInterstitial().catch((e) => __DEV__ && console.error(e));
			} else {
				AsyncStorage.setItem("@ad-counter", (val + 1).toString());
			}
		} else {
			AsyncStorage.setItem("@ad-counter", "0");
		}
	}, []);

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
