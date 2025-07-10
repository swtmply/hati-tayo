import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFooter,
	type BottomSheetFooterProps,
	BottomSheetView,
	useBottomSheet,
} from "@gorhom/bottom-sheet";
import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import type { TransactionShareMembers } from "@hati-tayo/backend/convex/types";
import { useMutation } from "convex/react";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn } from "~/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { CircleCheck } from "./ui/icons";
import { Text } from "./ui/text";

interface SettleTransactionFormSheetProps {
	index: number;
	onClose: () => void;
	onSubmit: (users: TransactionShareMembers) => void;
	members: TransactionShareMembers;
}

const SettleTransactionFormSheet = ({
	index,
	onClose,
	onSubmit,
	members,
}: SettleTransactionFormSheetProps) => {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedUsers, setSelectedUsers] =
		React.useState<TransactionShareMembers>([]);

	const { colorScheme } = useColorScheme();

	const handleSheetChanges = (index: number) => {
		if (index === -1) {
			onClose();
		}
	};

	const backdropComponent = (props: BottomSheetBackdropProps) => (
		<BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
	);

	const FooterComponent = (props: BottomSheetFooterProps) => {
		const { close } = useBottomSheet();

		const updateTransactionShare = useMutation(
			api.transaction_shares.updateTransactionShare,
		);

		const updateTransction = async () => {
			try {
				const response = await updateTransactionShare({
					ids: selectedUsers.map(
						(user) => user.share?._id as Id<"transactionShares">,
					),
				});

				if (response.ok) {
					onSubmit(selectedUsers);

					Toast.show({
						type: "success",
						text1: "Success",
						text2: "Transaction settled successfully",
					});

					close();
				} else {
					Toast.show({
						type: "error",
						text1: "Something went wrong",
						text2: "Failed to settle transaction",
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Something went wrong",
					text2: "Failed to settle transaction",
				});
			}
		};

		return (
			<BottomSheetFooter
				{...props}
				style={{
					paddingHorizontal: 16,
					paddingVertical: 32,
				}}
			>
				<Button
					disabled={selectedUsers.length === 0}
					onPress={updateTransction}
				>
					<Text>Settle Debts</Text>
				</Button>
			</BottomSheetFooter>
		);
	};

	const snapPoints = ["75%", "95%"];

	return (
		<BottomSheet
			backdropComponent={backdropComponent}
			ref={bottomSheetRef}
			onChange={handleSheetChanges}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			index={index}
			footerComponent={FooterComponent}
			handleClassName="bg-background rounded-t-2xl"
			handleIndicatorStyle={{
				backgroundColor: colorScheme === "dark" ? "#4caf50" : "#2e7d32",
			}}
			backgroundStyle={{
				backgroundColor: colorScheme === "dark" ? "#1c2a1f" : "#f8f5f0",
			}}
		>
			<BottomSheetView className="gap-4 p-4">
				<Text className="font-geist-semibold text-2xl">Select Members</Text>
				{members.map((member) => (
					<TouchableOpacity
						key={member._id}
						className="flex-row items-center justify-between"
						onPress={() => {
							setSelectedUsers((prev) =>
								prev.includes(member)
									? prev.filter((u) => u._id !== member._id)
									: [...prev, member],
							);
						}}
					>
						<View className="flex-row items-center gap-2">
							<Avatar alt={member.name}>
								<AvatarImage source={{ uri: member.image }} />
							</Avatar>
							<Text className="font-geist-semibold">{member.name}</Text>
						</View>
						<CircleCheck
							className={cn(
								"text-foreground",
								selectedUsers.includes(member) &&
									"rounded-full bg-secondary text-primary",
							)}
						/>
					</TouchableOpacity>
				))}
			</BottomSheetView>
		</BottomSheet>
	);
};

export default SettleTransactionFormSheet;
