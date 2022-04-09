import "dotenv/config";

export default {
	name: "Stratos",
	slug: "Stratos",
	version: "1.1.0",
	sdkVersion: "44.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: "armyapp.apk",
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#FFFFFF",
		},
		package: "armyapp.apk",
		permissions: [],
		versionCode: 8,
		config: {
			googleMobileAdsAppId: process.env.APP_ID,
		},
	},
	web: {
		favicon: "./assets/favicon.png",
	},
	userInterfaceStyle: "automatic",
	description: "",
};
