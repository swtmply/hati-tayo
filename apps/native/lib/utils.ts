import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateImage() {
	const maxPartCounts = {
		accessory: 18,
		eye: 6,
		face: 8,
		hair: 32,
		mouth: 10,
		outfit: 25,
	};

	const randomAccessory = Math.floor(Math.random() * maxPartCounts.accessory);
	const randomEye = Math.floor(Math.random() * maxPartCounts.eye);
	const randomFace = Math.floor(Math.random() * maxPartCounts.face);
	const randomHair = Math.floor(Math.random() * maxPartCounts.hair);
	const randomMouth = Math.floor(Math.random() * maxPartCounts.mouth);
	const randomOutfit = Math.floor(Math.random() * maxPartCounts.outfit);

	const randomAccessoryFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomAccessory);

	const randomEyeFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomEye);

	const randomFaceFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomFace);

	const randomHairFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomHair);

	const randomMouthFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomMouth);

	const randomOutfitFormatted = Intl.NumberFormat("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	}).format(randomOutfit);

	return `https://avartation-api.vercel.app/api?hair=${randomHairFormatted}&bg=rgb(56,%20141,%2061)&eyes=${randomEyeFormatted}&mouth=${randomMouthFormatted}&head=${randomFaceFormatted}&outfit=${randomOutfitFormatted}&accessory=${randomAccessoryFormatted}`;
}
