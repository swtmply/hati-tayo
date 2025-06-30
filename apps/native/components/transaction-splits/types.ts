import type { Doc } from "@hati-tayo/backend/convex/_generated/dataModel";
import type { useAppForm } from "~/hooks/useAppForm";

// This is a generic type for the form instance.
// You might want to create a more specific type based on your form's structure if needed.
type AppFormType = ReturnType<typeof useAppForm<any>>;

export type SelectedMember = Doc<"users"> & {
	email?: string | undefined;
	phoneNumber?: string | undefined;
};

export interface SplitInputComponentProps {
	form: AppFormType;
	selectedMembers: SelectedMember[];
	// Path to the array of split detail objects in the form state, e.g., "splitDetails"
	detailsArrayPath: string;
}
