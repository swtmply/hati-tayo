import { router } from "expo-router";
import AnimatedTransactionList from "~/components/animated-transactions-list";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Plus } from "~/components/ui/icons";
import { Text } from "~/components/ui/text";

export default function HomePage() {
	return (
		<Container>
			<Text className="mb-2 font-bold text-3xl text-foreground">Home</Text>

			<AnimatedTransactionList />

			<Button
				size={"icon"}
				className="absolute right-6 bottom-6 aspect-square h-16 w-16"
				onPress={() => router.push("/create-transaction")}
			>
				<Plus className="text-white" />
			</Button>
		</Container>
	);
}
