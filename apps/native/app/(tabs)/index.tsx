import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AnimatedTransactionList from "~/components/animated-transactions-list";
import { Container } from "~/components/container";
import { Text } from "~/components/ui/text";

export default function HomePage() {
	const bottomTabBarHeight = useBottomTabBarHeight();

	return (
		<Container>
			<Text className="mb-2 font-bold text-3xl text-foreground">Home</Text>

			<AnimatedTransactionList />
		</Container>
	);
}
