import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFooter,
	type BottomSheetFooterProps,
	BottomSheetScrollView,
	useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useStore } from "@tanstack/react-form";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { withForm } from "~/hooks/useAppForm";
import { createTransactionFormOpts } from "~/lib/form/schemas/transactions-schema";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn } from "~/lib/utils";
import useSelectedShareFieldStore from "~/store/share-split";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CircleCheck } from "../ui/icons";

const AddMemberToShareFormSheet = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const bottomSheetRef = React.useRef<BottomSheet>(null);
		const { colorScheme } = useColorScheme();
		const selectedShareField = useSelectedShareFieldStore(
			(state) => state.selectedShareField,
		);
		const setSelectedShareField = useSelectedShareFieldStore(
			(state) => state.setSelectedShareField,
		);

		const handleSheetChanges = (index: number) => {
			if (index === -1) {
				setSelectedShareField(null);
			}
		};

		const backdropComponent = (props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		);

		const FooterComponent = (props: BottomSheetFooterProps) => {
			const { close } = useBottomSheet();

			return (
				<BottomSheetFooter
					{...props}
					style={{
						paddingHorizontal: 16,
						paddingVertical: 32,
					}}
				>
					<Button
						onPress={() => {
							close();
							setSelectedShareField(null);
						}}
					>
						<Text>Submit</Text>
					</Button>
				</BottomSheetFooter>
			);
		};

		const snapPoints = ["75%", "95%"];

		const members = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		const splitType = useStore(form.store, (state) => state.values.splitType);

		if (selectedShareField === null || splitType !== "SHARED") {
			return <></>;
		}

		return (
			<BottomSheet
				backdropComponent={backdropComponent}
				ref={bottomSheetRef}
				onChange={handleSheetChanges}
				snapPoints={snapPoints}
				index={selectedShareField !== null ? 0 : -1}
				enableDynamicSizing={false}
				footerComponent={FooterComponent}
				handleClassName="bg-background rounded-t-2xl"
				handleIndicatorStyle={{
					backgroundColor: colorScheme === "dark" ? "#4caf50" : "#2e7d32",
				}}
				backgroundStyle={{
					backgroundColor: colorScheme === "dark" ? "#1c2a1f" : "#f8f5f0",
				}}
			>
				<BottomSheetScrollView className="h-full gap-4 bg-background p-4">
					<View className="flex-row items-center justify-between">
						<Text className="font-geist-semibold text-2xl">Select Members</Text>
					</View>
					<form.Subscribe
						selector={(state) =>
							state.values.items.find((item, i) => i === selectedShareField)
						}
					>
						{(field) => {
							if (!field) {
								return null;
							}

							return (
								<View className="my-4 gap-4">
									{members.map((member) => {
										const selected = field?.participantIds.includes(member._id);

										return (
											<TouchableOpacity
												key={`member-${member._id}`}
												onPress={() => {
													if (selected) {
														const index = field.participantIds.indexOf(
															member._id,
														);

														form.removeFieldValue(
															`items[${selectedShareField}].participantIds`,
															index,
														);
													} else {
														form.pushFieldValue(
															`items[${selectedShareField}].participantIds`,
															member._id,
														);
													}
												}}
												className="flex-row items-center justify-between"
											>
												<View className="flex-row items-center gap-2">
													<Avatar alt={member.name}>
														<AvatarImage
															source={{
																uri: member.image,
															}}
														/>
														<AvatarImage
															source={{
																uri: member.image,
															}}
														/>
													</Avatar>
													<Text className=" font-geist-semibold">
														{member.name}
													</Text>
												</View>
												<CircleCheck
													className={cn(
														"rounded-full text-foreground",
														selected && "bg-secondary text-primary",
													)}
												/>
											</TouchableOpacity>
										);
									})}
								</View>
							);
						}}
					</form.Subscribe>
				</BottomSheetScrollView>
			</BottomSheet>
		);
	},
});

export default AddMemberToShareFormSheet;
