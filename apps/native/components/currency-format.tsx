import React from "react";
import { cn } from "~/lib/utils";
import { Text } from "./ui/text";

interface CurrencyFormatProps {
	className?: string;
	amount: number;
}

const CurrencyFormat = ({ amount, className }: CurrencyFormatProps) => {
	return (
		<Text className={cn(className)}>
			{new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(amount)}
		</Text>
	);
};

export default CurrencyFormat;
