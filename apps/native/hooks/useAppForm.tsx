import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		Input,
	},
	formComponents: {
		Button,
	},
	fieldContext,
	formContext,
});
