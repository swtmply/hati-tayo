import type { LucideIcon } from "lucide-react-native";
import {
	Bell,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronUp,
	CircleCheck,
	Plus,
	Rainbow,
	X,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

export function iconWithClassName(icon: LucideIcon) {
	cssInterop(icon, {
		className: {
			target: "style",
			nativeStyleToProp: {
				color: true,
				opacity: true,
			},
		},
	});
}

iconWithClassName(Rainbow);
iconWithClassName(Check);
iconWithClassName(CircleCheck);
iconWithClassName(ChevronDown);
iconWithClassName(ChevronUp);
iconWithClassName(X);
iconWithClassName(Bell);
iconWithClassName(Plus);
iconWithClassName(ChevronLeft);

export {
	Bell,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronUp,
	CircleCheck,
	Plus,
	Rainbow,
	X,
};
