import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const createTransactionFormOpts = formOptions({
	defaultValues: {
		groupName: "",
		groupId: "",
		transactionName: "",
		amount: "",
		members: [] as SplitMember[],
		selectedMembers: [] as SplitMember[],
		splitType: "EQUAL",
		payer: "",
		percentages: [] as { userId: string; percentage: number }[],
		fixedAmounts: [] as { userId: string; amount: number }[],
		items: [{ amount: 0, name: "", participantIds: [] }] as {
			participantIds: string[];
			name: string;
			amount: number;
		}[],
	},
});

const baseSplitSchema = z.object({
	groupName: z.string().min(1, "Group name is required."),
	groupId: z.string(),
	transactionName: z.string().min(1, "Transaction name is required."),
	amount: z
		.string()
		.min(1, "Amount is required.")
		.refine(
			(val) =>
				!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
			{
				message: "Amount must be a positive number.",
			},
		),
	members: z.array(
		z.object({
			_id: z.string(),
			name: z.string(),
			image: z.string(),
			email: z.string().optional(),
			phoneNumber: z.string().optional(),
		}),
	),
	selectedMembers: z.array(
		z.object({
			_id: z.string(),
			name: z.string(),
			image: z.string(),
			email: z.string().optional(),
			phoneNumber: z.string().optional(),
		}),
	),
	payer: z.string().min(1, "A payer must be selected."),
});

const equalSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("EQUAL"),
});

const percentageSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("PERCENTAGE"),
	percentages: z
		.array(
			z.object({
				userId: z.string(),
				percentage: z
					.number()
					.min(1, "Percentage must be at least 1.")
					.max(100, "Percentage must be at most 100."),
			}),
		)
		.superRefine((data, ctx) => {
			if (data.reduce((acc, curr) => acc + curr.percentage, 0) !== 100) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Percentages must sum to 100.",
				});
			}
		}),
});

const fixedSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("FIXED"),
	fixedAmounts: z.array(
		z.object({
			userId: z.string(),
			amount: z.number().min(1, "Amount must be at least 1."),
		}),
	),
});

const sharedSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("SHARED"),
	items: z.array(
		z.object({
			participantIds: z
				.array(z.string())
				.min(1, "At least one participant is required."),
			name: z.string().min(1, "Item name is required."),
			amount: z.number().min(1, "Amount must be at least 1."),
		}),
	),
});

export const splitSchema = z
	.discriminatedUnion("splitType", [
		equalSplitSchema,
		percentageSplitSchema,
		fixedSplitSchema,
		sharedSplitSchema,
	])
	.superRefine((data, ctx) => {
		if (
			data.splitType === "FIXED" &&
			data.fixedAmounts.reduce((acc, curr) => acc + curr.amount, 0) !==
				Number.parseFloat(data.amount)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Amounts must sum to the total amount.",
			});
		}

		if (
			data.splitType === "SHARED" &&
			data.items.reduce((acc, curr) => acc + curr.amount, 0) !==
				Number.parseFloat(data.amount)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Amounts must sum to the total amount.",
			});
		}
	});

export type SplitMember = z.infer<typeof baseSplitSchema>["members"][number];
export type SplitForm = z.infer<typeof splitSchema>;
