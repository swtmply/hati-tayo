import * as DialogPrimitive from "@rn-primitives/dialog";
import type * as React from "react";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { X } from "./icons";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlayWeb({
	className,
	...props
}: DialogPrimitive.OverlayProps & {
	ref?: React.RefObject<DialogPrimitive.OverlayRef>;
}) {
	const { open } = DialogPrimitive.useRootContext();
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/80 p-2",
				open
					? "web:fade-in-0 web:animate-in"
					: "web:fade-out-0 web:animate-out",
				className,
			)}
			{...props}
		/>
	);
}

function DialogOverlayNative({
	className,
	children,
	...props
}: DialogPrimitive.OverlayProps & {
	ref?: React.RefObject<DialogPrimitive.OverlayRef>;
	children?: React.ReactNode;
}) {
	return (
		<DialogPrimitive.Overlay
			style={StyleSheet.absoluteFill}
			className={cn(
				"flex items-center justify-center bg-black/80 p-2",
				className,
			)}
			{...props}
		>
			<Animated.View
				entering={FadeIn.duration(150)}
				exiting={FadeOut.duration(150)}
			>
				{children}
			</Animated.View>
		</DialogPrimitive.Overlay>
	);
}

const DialogOverlay = Platform.select({
	web: DialogOverlayWeb,
	default: DialogOverlayNative,
});

function DialogContent({
	className,
	children,
	portalHost,
	...props
}: DialogPrimitive.ContentProps & {
	ref?: React.RefObject<DialogPrimitive.ContentRef>;
	className?: string;
	portalHost?: string;
}) {
	const { open } = DialogPrimitive.useRootContext();
	return (
		<DialogPortal hostName={portalHost}>
			<DialogOverlay>
				<DialogPrimitive.Content
					className={cn(
						"max-w-lg web:cursor-default gap-4 rounded-lg border border-border bg-background p-6 shadow-lg web:duration-200",
						open
							? "web:fade-in-0 web:zoom-in-95 web:animate-in"
							: "web:fade-out-0 web:zoom-out-95 web:animate-out",
						className,
					)}
					{...props}
				>
					{children}
					<DialogPrimitive.Close
						className={
							"web:group absolute top-4 right-4 rounded-sm p-0.5 opacity-70 web:ring-offset-background web:transition-opacity web:hover:opacity-100 web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2 web:disabled:pointer-events-none"
						}
					>
						<X
							size={Platform.OS === "web" ? 16 : 18}
							className={cn(
								"text-muted-foreground",
								open && "text-accent-foreground",
							)}
						/>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogOverlay>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: ViewProps) {
	return (
		<View
			className={cn(
				"flex flex-col gap-1.5 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: ViewProps) {
	return (
		<View
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: DialogPrimitive.TitleProps & {
	ref?: React.RefObject<DialogPrimitive.TitleRef>;
}) {
	return (
		<DialogPrimitive.Title
			className={cn(
				"font-semibold native:text-xl text-foreground text-lg leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: DialogPrimitive.DescriptionProps & {
	ref?: React.RefObject<DialogPrimitive.DescriptionRef>;
}) {
	return (
		<DialogPrimitive.Description
			className={cn(
				"native:text-base text-muted-foreground text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
