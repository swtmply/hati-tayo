import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFooter,
	type BottomSheetFooterProps,
	BottomSheetView,
	useBottomSheet,
} from "@gorhom/bottom-sheet";
import type { Doc } from "@hati-tayo/backend/convex/_generated/dataModel";
import { remapProps } from "nativewind";
import * as React from "react";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/use-color-scheme";
import SearchUserComboBox from "./search-user-combo-box";
import { Button } from "./ui/button";

interface AddMemberFormSheetProps {
	index: number;
	onClose: () => void;
	onSubmit: (users: Doc<"users">[]) => void;
}

declare module "@gorhom/bottom-sheet" {
	interface BottomSheetProps {
		className?: string;
		containerClassName?: string;
		backgroundClassName?: string;
		handleClassName?: string;
		handleIndicatorClassName?: string;
	}
}

remapProps(BottomSheet, {
	className: "style",
	containerClassName: "containerStyle",
	backgroundClassName: "backgroundStyle",
	handleClassName: "handleStyle",
	handleIndicatorClassName: "handleIndicatorStyle",
});

const AddMemberFormSheet = ({
	index,
	onClose,
	onSubmit,
}: AddMemberFormSheetProps) => {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedUsers, setSelectedUsers] = React.useState<Doc<"users">[]>([]);
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
						close();
					}}
				>
					<Text>Submit</Text>
				</Button>
			</BottomSheetFooter>
		);
	};

	const snapPoints = ["75%", "100%"];

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
			<BottomSheetView className="h-full gap-4 bg-background p-4">
				<Text className="font-geist-semibold text-2xl">Add Members</Text>
				<SearchUserComboBox
					onUserSelect={setSelectedUsers}
					selectedUsers={selectedUsers}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
};

export default AddMemberFormSheet;
