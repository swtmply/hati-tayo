import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
	className,
	asChild = false,
	...props
}: React.ComponentProps<typeof RNText> & {
	ref?: React.RefObject<RNText>;
	asChild?: boolean;
}) {
	const textClass = React.useContext(TextClassContext);
	return (
		<RNText
			className={cn(
				"web:select-text font-sans text-base text-foreground",
				textClass,
				className,
			)}
			{...props}
		/>
	);
}

export { Text, TextClassContext };
