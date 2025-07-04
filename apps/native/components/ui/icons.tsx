import type { LucideIcon } from "lucide-react-native";
import {
	Bell,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	CircleCheck,
	Plus,
	Rainbow,
	Trash,
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
iconWithClassName(ChevronRight);
iconWithClassName(Trash);

export {
	Bell,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	CircleCheck,
	Plus,
	Rainbow,
	Trash,
	X,
};
