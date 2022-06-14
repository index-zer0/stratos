import React from "react";
import { StatusBar } from "expo-status-bar";
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

const App = () => {
    React.useEffect(async () => {
        showInterstitial().catch((e) => __DEV__ && console.error(e));
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

const colorModeManager = {
    get: async () => {
        try {
            let val = await AsyncStorage.getItem("@color-mode");
            return val === "dark" ? "dark" : "light";
        } catch (e) {
            return "light";
        }
    },
    set: async (value) => {
        try {
            await AsyncStorage.setItem("@color-mode", value);
        } catch (e) {
            console.log(e);
        }
    },
};
