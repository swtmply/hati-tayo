import { SafeAreaView } from "react-native";

export const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<SafeAreaView className="relative flex-1 gap-4 bg-background p-6 pt-12">
			{children}
		</SafeAreaView>
	);
};
