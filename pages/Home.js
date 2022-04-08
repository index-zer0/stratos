import React from "react";
import {
	Pressable,
	StyleSheet,
	Dimensions,
	ImageBackground,
	Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Circle } from "react-native-progress";
import {
	Box,
	Text,
	Heading,
	useColorMode,
	useColorModeValue,
	IconButton,
	Icon,
	Button,
	Modal,
	NumberInput,
	NumberInputField,
	FormControl,
	Container,
	Input as TextInput,
	Alert,
	HStack,
	VStack,
} from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import ConfettiCannon from "react-native-confetti-cannon";

const header_size = 0.15;
const center_size = 0.6;
const footer_size = 0.25;

const _storeData = async (field, value) => {
	try {
		await AsyncStorage.setItem(field, value);
	} catch (error) {
		// Error saving data
	}
};
const _retrieveData = async (field) => {
	try {
		const value = await AsyncStorage.getItem(field);
		if (value !== null) {
			return value;
		}
	} catch (error) {
		// Error retrieving data
	}
};

const getDateString = (date) => {
	if (Platform.OS === "ios")
		return date.toLocaleDateString("el-GR", {
			day: "numeric",
			month: "numeric",
			year: "numeric",
		});
	else {
		var dayOfWeek = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
			monthName = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			],
			utc = date.getTime() + date.getTimezoneOffset() * 60000,
			US_time = utc + 3600000 * -4,
			US_date = new Date(US_time);

		return (
			US_date.getDate() +
			"/" +
			(US_date.getMonth() + 1) +
			"/" +
			US_date.getFullYear()
		);
	}
};

const validDates = (katataksi, apolush) => {
	if (!katataksi || !apolush) {
		return true;
	}
	return !(katataksi.getTime() > apolush.getTime());
};

const Home = () => {
	const [katataksi, setKatataksi] = React.useState(null);
	const [apolush, setApolush] = React.useState(null);
	const [showModal, setShowModal] = React.useState(false);
	const [meresAnaVdomada, setMeresAnaVdomada] = React.useState(7);
	const [upiresiesAnaVdomada, setUpiresiesAnaVdomada] = React.useState(7);
	const [adeies, setAdeies] = React.useState(0);
	const [fulakh, setFulakh] = React.useState(0);
	const viewShot = React.useRef();

	const captureAndShareScreenshot = () => {
		viewShot.current.capture().then((uri) => {
			Sharing.shareAsync("file://" + uri);
		}),
			(error) => console.error("Oops, snapshot failed", error);
	};

	React.useEffect(() => {
		_retrieveData("@katataksi").then((value) => {
			if (value !== null && value !== undefined) {
				setKatataksi(new Date(value));
			} else {
				setKatataksi(new Date());
			}
		});
		_retrieveData("@apolush").then((value) => {
			if (value !== null && value !== undefined) {
				setApolush(new Date(value));
			} else {
				setApolush(
					new Date(
						new Date().setFullYear(new Date().getFullYear() + 1)
					)
				);
			}
		});
		_retrieveData("@meresAnaVdomada").then((value) => {
			if (value !== null && value !== undefined) {
				setMeresAnaVdomada(parseFloat(value));
			}
		});
		_retrieveData("@upiresiesAnaVdomada").then((value) => {
			if (value !== null && value !== undefined) {
				setUpiresiesAnaVdomada(parseFloat(value));
			}
		});
		_retrieveData("@adeies").then((value) => {
			if (value !== null && value !== undefined) {
				setAdeies(parseInt(value));
			}
		});
		_retrieveData("@fulakh").then((value) => {
			if (value !== null && value !== undefined) {
				setAdeies(parseInt(value));
			}
		});
	}, []);
	return (
		<ViewShot
			options={{ format: "jpg", quality: 1 }}
			ref={viewShot}
			style={[
				styles.container,
				{
					backgroundColor: useColorModeValue("#d3d6ce", "#1f2937"),
				},
			]}
		>
			<Header {...{ captureAndShareScreenshot }} />
			<Center
				{...{
					katataksi,
					setKatataksi,
					apolush,
					setApolush,
					showModal,
					setShowModal,
					meresAnaVdomada,
					upiresiesAnaVdomada,
					adeies,
					fulakh,
				}}
			/>
			<Footer {...{ katataksi, apolush }} />
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<Modal.Content
					maxWidth={(Dimensions.get("window").width * 90) / 100}
				>
					<Modal.CloseButton />
					<Modal.Body>
						<Container key="adeies">
							<FormControl>
								<FormControl.Label>
									Αριθμός αδειών
								</FormControl.Label>
								<NumberInput
									value={adeies}
									onChange={(value) => {
										if (isNaN(value)) {
											value = 0;
										}
										setAdeies(value);
										_storeData("@adeies", value.toString());
									}}
									min={0}
									max={100}
									step={1}
								>
									<NumberInputField />
								</NumberInput>
								<FormControl.HelperText>
									Ο αριθμός όλων των αδειών που απομένουν στην
									θητεία σας.
								</FormControl.HelperText>
							</FormControl>
						</Container>
						<Container marginTop={5} key="fulakh">
							<FormControl>
								<FormControl.Label>
									Ποινή Φυλακής (πρόσθετη θητεία)
								</FormControl.Label>
								<NumberInput
									value={fulakh}
									onChange={(value) => {
										if (isNaN(value)) {
											value = 0;
										}
										setFulakh(value);
										_storeData("@fulakh", value.toString());
									}}
									min={0}
									max={100}
									step={1}
								>
									<NumberInputField />
								</NumberInput>
								<FormControl.HelperText>
									Οι μέρες φυλακής που σας έχουν αποδοθεί.
								</FormControl.HelperText>
							</FormControl>
						</Container>
						<Container marginTop={5} key="meresAnaVdomada">
							<FormControl>
								<FormControl.Label>
									Μέσος αριθμός ημερών στο στρατόπεδο ανά
									βδομάδα
								</FormControl.Label>
								<TextInput
									keyboardType="decimal-pad"
									value={meresAnaVdomada.toString()}
									onChangeText={(value) => {
										if (isNaN(value)) {
											value = 0;
										}
										if (parseFloat(value) > 7) {
											setMeresAnaVdomada(7.0);
											_storeData(
												"@meresAnaVdomada",
												"7.0"
											);
										} else {
											setMeresAnaVdomada(value);
											_storeData(
												"@meresAnaVdomada",
												value
											);
										}
									}}
								/>
								<FormControl.HelperText>
									Ο μέσος όρος των ημερών που θα παρευρίσκεστε
									στο στρατόπεδο ανά βδομάδα .
								</FormControl.HelperText>
							</FormControl>
						</Container>
						<Container marginTop={5} key="upiresiesAnaVdomada">
							<FormControl>
								<FormControl.Label>
									Μέσος αριθμός υπηρεσιών ανά βδομάδα
								</FormControl.Label>
								<TextInput
									keyboardType="decimal-pad"
									value={upiresiesAnaVdomada.toString()}
									onChangeText={(value) => {
										if (isNaN(value)) {
											value = 0;
										}
										if (parseFloat(value) > 7) {
											setUpiresiesAnaVdomada(7.0);
											_storeData(
												"@upiresiesAnaVdomada",
												"7.0"
											);
										} else {
											setUpiresiesAnaVdomada(value);
											_storeData(
												"@upiresiesAnaVdomada",
												value
											);
										}
									}}
								/>
								<FormControl.HelperText>
									Ο μέσος όρος των υπηρεσιών που εκτελείτε ανά
									βδομάδα.
								</FormControl.HelperText>
							</FormControl>
						</Container>
					</Modal.Body>
					<Modal.Footer>
						<Button
							onPress={() => {
								setShowModal(false);
							}}
						>
							Κλείσιμο
						</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</ViewShot>
	);
};

export default Home;

const Header = ({ captureAndShareScreenshot }) => {
	const insets = useSafeAreaInsets();
	const { toggleColorMode } = useColorMode();
	return (
		<Box
			style={[
				styles.section,
				{
					flex: header_size,
					flexDirection: "row",
					justifyContent: "space-between",
				},
			]}
		>
			<IconButton
				variant="unstyled"
				marginRight="auto"
				marginLeft={insets.left + 5}
				onPress={captureAndShareScreenshot}
				icon={<Icon size="sm" as={<Feather name="share" />} />}
			/>
			<Heading fontWeight={600} fontFamily="monospace">
				Stratos
			</Heading>
			<IconButton
				variant="ghost"
				marginLeft="auto"
				marginRight={insets.right + 5}
				onPress={toggleColorMode}
				icon={
					<Icon
						size="sm"
						as={<Feather name={useColorModeValue("moon", "sun")} />}
					/>
				}
			/>
		</Box>
	);
};

const Center = ({
	katataksi,
	setKatataksi,
	apolush,
	setApolush,
	showModal,
	setShowModal,
	meresAnaVdomada,
	upiresiesAnaVdomada,
	adeies,
	fulakh,
}) => {
	const cs =
		Dimensions.get("window").height > 750
			? (Dimensions.get("window").width * 80) / 100
			: (Dimensions.get("window").width * 70) / 100;
	const [progress, setProgress] = React.useState(0.0);
	const [showConfetti, setShowConfetti] = React.useState(false);

	const [isDatePickerVisible1, setDatePickerVisibility1] =
		React.useState(false);
	const [isDatePickerVisible2, setDatePickerVisibility2] =
		React.useState(false);

	React.useEffect(() => {
		const real_progress =
			getDifferenceInDays(katataksi, new Date()) /
			(getDifferenceInDays(katataksi, apolush) - 1);
		let counter = Math.max(progress, 0);

		const interval = setInterval(() => {
			if (real_progress > counter) {
				setProgress((p) => p + 0.01);
				counter += 0.01;
			} else {
				setProgress(real_progress);
				clearInterval(interval);
				if (real_progress >= 1) {
					setShowConfetti(true);
				}
			}
		}, 100);
		return () => clearInterval(interval);
	}, [katataksi, apolush]);

	return (
		<Box style={[styles.section, { flex: center_size }]}>
			{showConfetti && (
				<ConfettiCannon
					count={100}
					origin={{ x: -10, y: 0 }}
					fadeOut={true}
				/>
			)}
			<Box
				style={{
					flexDirection: "row",
					display: "flex",
					width: (Dimensions.get("window").width * 80) / 100,
					justifyContent: "space-between",
					marginBottom: 30,
				}}
			>
				<Box
					backgroundColor={useColorModeValue(
						"#f5f5f5aa",
						"#3d3d3daa"
					)}
					px="3"
					py="1"
					borderRadius="5"
				>
					<Pressable
						onPress={() => setDatePickerVisibility1(true)}
						style={styles.datePicker}
					>
						<Text style={styles.datePickerText}>
							{katataksi
								? getDateString(katataksi)
								: "Ημ/νια κατάταξης"}
						</Text>
					</Pressable>
				</Box>
				<Text>-</Text>
				<Box
					backgroundColor={useColorModeValue(
						"#f5f5f5aa",
						"#3d3d3daa"
					)}
					px="3"
					py="1"
					borderRadius="5"
				>
					<Pressable
						onPress={() => setDatePickerVisibility2(true)}
						style={styles.datePicker}
					>
						<Text style={styles.datePickerText}>
							{apolush
								? getDateString(apolush)
								: "Ημ/νια απόλυσης"}
						</Text>
					</Pressable>
				</Box>
			</Box>
			<DateTimePickerModal
				isVisible={isDatePickerVisible1}
				mode="date"
				onConfirm={(date) => {
					setKatataksi(date);
					_storeData("@katataksi", date.toString());
					setDatePickerVisibility1(false);
				}}
				onCancel={() => setDatePickerVisibility1(false)}
				locale="el_GR"
			/>
			<DateTimePickerModal
				isVisible={isDatePickerVisible2}
				mode="date"
				onConfirm={(date) => {
					setApolush(date);
					_storeData("@apolush", date.toString());
					setDatePickerVisibility2(false);
				}}
				onCancel={() => setDatePickerVisibility2(false)}
				locale="el_GR"
			/>
			{!validDates(katataksi, apolush) && <AlertDate />}
			{validDates(katataksi, apolush) && (
				<Circle
					size={cs}
					showsText
					thickness={8}
					progress={progress}
					formatText={(progress) => (progress * 100).toFixed(2) + "%"}
					color={useColorModeValue("#4a6046", "#deb309")}
				/>
			)}
			<Box marginTop={5} />
			{validDates(katataksi, apolush) && (
				<Camo height={10} onPress={() => setShowModal(true)}>
					<Box flexDirection="row" alignItems="center" w="90%">
						<Text color="white" fontSize="lg">
							{Math.max(
								(((getDifferenceInDays(new Date(), apolush) -
									1 -
									adeies +
									fulakh) /
									7) *
									meresAnaVdomada) |
									0,
								0
							)}
						</Text>
						<Text color="white"> ημέρες στο στρατόπεδο</Text>
						<IconButton
							variant="unstyled"
							marginLeft="auto"
							onPress={() => {}}
							icon={
								<Icon
									size="sm"
									color="white"
									as={<Feather name="info" />}
								/>
							}
						/>
					</Box>
				</Camo>
			)}
			<Box marginTop={5} />
			{validDates(katataksi, apolush) && (
				<Camo height={10} onPress={() => setShowModal(true)}>
					<Box flexDirection="row" alignItems="center" w="90%">
						<Text color="white" fontSize="lg">
							{Math.max(
								(((getDifferenceInDays(new Date(), apolush) -
									1 -
									adeies +
									fulakh) /
									7) *
									upiresiesAnaVdomada) |
									0,
								0
							)}
						</Text>
						<Text color="white"> υπηρεσίες</Text>
						<IconButton
							variant="unstyled"
							marginLeft="auto"
							onPress={() => {}}
							icon={
								<Icon
									size="sm"
									color="white"
									as={<Feather name="info" />}
								/>
							}
						/>
					</Box>
				</Camo>
			)}
			<Box marginTop={5} />
		</Box>
	);
};

const Footer = ({ katataksi, apolush }) => {
	const h =
		Dimensions.get("window").height > 750
			? Dimensions.get("window").height * footer_size - 15
			: Dimensions.get("window").height * footer_size - 25;
	return (
		<Box style={[styles.section, { flex: footer_size, color: "white" }]}>
			{validDates(katataksi, apolush) && (
				<Camo height={h}>
					<Box style={{ flexDirection: "row" }}>
						<Heading
							size="4xl"
							fontWeight="600"
							color="white"
							styles={styles.textWithShadow}
						>
							{(getDifferenceInDays(new Date(), apolush) - 1) | 0}
						</Heading>
						<Text
							fontSize="xl"
							style={[
								styles.textWithShadow,
								{
									color: "white",
									position: "relative",
									top: 37,
								},
							]}
						>
							ΚΣ
						</Text>
					</Box>
					<Box
						style={{
							flexDirection: "row",
							display: "flex",
							width: (Dimensions.get("window").width * 80) / 100,
							justifyContent: "space-between",
							marginTop: 30,
							zIndex: 100000,
						}}
					>
						<Text
							style={[
								styles.textWithShadow,
								{
									marginRight: "auto",
									fontSize: 15,
									color: "white",
								},
							]}
						>{`Υπηρετήθηκαν: ${
							getDifferenceInDays(katataksi, new Date()) | 0
						}`}</Text>
						<Text
							style={[
								styles.textWithShadow,
								{
									marginLeft: "auto",
									fontSize: 15,
									color: "white",
								},
							]}
						>{`Συνολικές: ${
							(getDifferenceInDays(katataksi, apolush) - 1) | 0
						}`}</Text>
					</Box>
				</Camo>
			)}
		</Box>
	);
};

const Camo = ({ height, onPress, children }) => {
	return (
		<Pressable
			onPress={onPress ? onPress : () => {}}
			style={({ pressed }) => [
				{
					opacity: pressed && onPress !== undefined ? 0.7 : 1,
				},
			]}
		>
			<Box
				borderWidth={1}
				borderColor={useColorModeValue("#070014", "lightgrey")}
				shadow="7"
				height={height}
				width={Dimensions.get("window").width - 30}
				style={{
					marginLeft: 15,
					marginRight: 15,
					marginBottom: 15,
					rounded: 25,
					borderRadius: 25,
				}}
			>
				<ImageBackground
					style={{
						height: "100%",
						width: "100%",
						backgroundPosition: "right 20px bottom 10px",
					}}
					imageStyle={{ borderRadius: 25 }}
					source={useColorModeValue(
						require("../assets/green.jpg"),
						require("../assets/blue.jpg")
					)}
					alt="camo"
				>
					<Box
						width="100%"
						height="100%"
						rounded={25}
						style={{ backgroundColor: "rgba(0,0,0, 0.40)" }}
					>
						<Box
							style={styles.section}
							marginTop="auto"
							marginBottom="auto"
						>
							{children}
						</Box>
					</Box>
				</ImageBackground>
			</Box>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	section: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	center: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	footer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	datePicker: {
		backgroundColor: "transparent",
	},
	datePickerText: {
		fontSize: 16,
		textDecorationLine: "underline",
	},
	textWithShadow: {
		textShadowColor: "black",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
});

const getDifferenceInDays = (date1, date2) => {
	const diffInMs = Math.abs(date2 - date1);
	return diffInMs / (1000 * 60 * 60 * 24);
};

const AlertDate = () => {
	return (
		<Alert w="80%" status="warning">
			<VStack space={2} flexShrink={1} w="100%">
				<HStack flexShrink={1} space={2} justifyContent="space-between">
					<HStack space={2} flexShrink={1}>
						<Alert.Icon mt="1" />
						<Text fontSize="md" color="coolGray.800">
							Πρόβλημα με τις ημερομηνίες
						</Text>
					</HStack>
				</HStack>
			</VStack>
		</Alert>
	);
};
