import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFooter,
	type BottomSheetFooterProps,
	BottomSheetScrollView,
	useBottomSheet,
} from "@gorhom/bottom-sheet";
import type { Doc, Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/use-color-scheme";
import SearchUserComboBox from "./search-user-combo-box";
import { Button } from "./ui/button";
import { Plus } from "./ui/icons";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { useKeyboard } from "~/hooks/useKeyboard";
import { cn } from "~/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddMemberFormSheetProps {
	index: number;
	onClose: () => void;
	onSubmit: (users: CreateUser[]) => void;
}

export type CreateUser = Omit<Doc<"users">, "_creationTime">;

const AddMemberFormSheet = ({
	index,
	onClose,
	onSubmit,
}: AddMemberFormSheetProps) => {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedUsers, setSelectedUsers] = React.useState<CreateUser[]>([]);
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
						onSubmit(selectedUsers);

						setSelectedUsers([]);
						close();
					}}
				>
					<Text>Submit</Text>
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
			<BottomSheetScrollView className="h-full gap-4 bg-background p-4">
				<View className="flex-row items-center justify-between">
					<Text className="font-geist-semibold text-2xl">Add Members</Text>
					<AddAnonymousMemberDialog
						selectedUsers={selectedUsers}
						onUserSelect={setSelectedUsers}
					/>
				</View>
				<SearchUserComboBox
					onUserSelect={setSelectedUsers}
					selectedUsers={selectedUsers}
				/>
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

interface AddAnonymousMemberDialogProps {
	selectedUsers: CreateUser[];
	onUserSelect: React.Dispatch<React.SetStateAction<CreateUser[]>>;
}

const AddAnonymousMemberDialog = ({
	selectedUsers,
	onUserSelect,
}: AddAnonymousMemberDialogProps) => {
	const [userEmail, setUserEmail] = React.useState("");
	const [userName, setUserName] = React.useState("");
	const [userPhoneNumber, setUserPhoneNumber] = React.useState("");
	const { isKeyboardVisible } = useKeyboard();

	const addAnonymousMember = () => {
		onUserSelect((prev) => [
			...prev,
			{
				_id: `anonymous-user-${prev.length}` as Id<"users">,
				name: userName,
				image: `https://ui-avatars.com/api/?background=random&name=${userName.replace(" ", "+")}`,
				email: userEmail,
				phoneNumber: userPhoneNumber,
				groups: [],
				transactions: [],
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			},
		]);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={"sm"}
					variant={"outline"}
					className="flex-row items-center gap-1 rounded-full"
				>
					<Plus className="aspect-square native:h-2 text-foreground group-active:text-accent-foreground" />
					<Text>Anonymous Member</Text>
				</Button>
			</DialogTrigger>
			<DialogContent
				className={cn(
					"sm:max-w-[425px]",
					isKeyboardVisible ? "-translate-y-24" : "",
				)}
			>
				<DialogHeader>
					<DialogTitle>Enter member details</DialogTitle>
					<DialogDescription>
						Enter the name and email of the member you want to add.
					</DialogDescription>
				</DialogHeader>

				<Label>Name</Label>
				<Input placeholder="Name" onChangeText={setUserName} />

				<DialogFooter>
					<DialogClose asChild>
						<Button onPress={addAnonymousMember}>
							<Text>OK</Text>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddMemberFormSheet;
