// @ts-nocheck
import { cssInterop } from "nativewind";
import { BaseToast } from "react-native-toast-message";

cssInterop(BaseToast, {
	className: {
		target: "style",
	},
	contentContainerClassName: {
		target: "contentContainerStyle",
	},
	text1ClassName: {
		target: "text1Style",
	},
	text2ClassName: {
		target: "text2Style",
	},
});

export const toastConfig = {
	success: (props) => (
		<BaseToast
			{...props}
			className="border-l-0 bg-sidebar dark:bg-secondary"
			contentContainerClassName="px-4 border-2 border-primary rounded-lg"
			text1ClassName="font-geist-bold text-primary text-lg"
			text2ClassName="font-sans text-foreground text-base"
		/>
	),
	error: (props) => (
		<BaseToast
			{...props}
			className="border-l-0 bg-sidebar dark:bg-secondary"
			contentContainerClassName="px-4 border-2 border-destructive rounded-lg"
			text1ClassName="font-geist-bold text-destructive text-lg"
			text2ClassName="font-sans text-foreground text-base"
		/>
	),
};
