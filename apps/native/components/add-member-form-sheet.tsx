import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFooter,
	type BottomSheetFooterProps,
	BottomSheetView,
	useBottomSheet,
} from "@gorhom/bottom-sheet";
import type { Doc } from "@hati-tayo/backend/convex/_generated/dataModel";
import * as React from "react";
import { Text } from "~/components/ui/text";
import SearchUserComboBox from "./search-user-combo-box";
import { Button } from "./ui/button";

interface AddMemberFormSheetProps {
	index: number;
	onClose: () => void;
	onSubmit: (users: Doc<"users">[]) => void;
}

const AddMemberFormSheet = ({
	index,
	onClose,
	onSubmit,
}: AddMemberFormSheetProps) => {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedUsers, setSelectedUsers] = React.useState<Doc<"users">[]>([]);

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
		>
			<BottomSheetView className="gap-4 p-4">
				<Text className="font-semibold text-2xl">Add Members</Text>
				<SearchUserComboBox
					onUserSelect={setSelectedUsers}
					selectedUsers={selectedUsers}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
};

export default AddMemberFormSheet;
