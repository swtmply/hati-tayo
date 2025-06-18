import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

function Input({
	className,
	placeholderClassName,
	...props
}: TextInputProps & {
	ref?: React.RefObject<TextInput>;
}) {
	return (
		<TextInput
			className={cn(
				"web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 native:text-lg text-base text-foreground native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm",
				props.editable === false && "web:cursor-not-allowed opacity-50",
				className,
			)}
			placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
			{...props}
		/>
	);
}

export { Input };
