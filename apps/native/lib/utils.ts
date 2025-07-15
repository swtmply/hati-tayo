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

  const randomAccessory =
    Math.floor(Math.random() * maxPartCounts.accessory) + 1;
  const randomEye = Math.floor(Math.random() * maxPartCounts.eye) + 1;
  const randomFace = Math.floor(Math.random() * maxPartCounts.face) + 1;
  const randomHair = Math.floor(Math.random() * maxPartCounts.hair) + 1;
  const randomMouth = Math.floor(Math.random() * maxPartCounts.mouth) + 1;
  const randomOutfit = Math.floor(Math.random() * maxPartCounts.outfit) + 1;

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
