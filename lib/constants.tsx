import { Plus } from "~/components/icons";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(142.1 76.2% 36.3%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(142.1 70.6% 45.3%)", // primary
    text: "hsl(0 0% 95%)", // foreground
  },
};

export const LINKS = [
  {
    title: "New Transaction",
    icon: <Plus className="text-foreground" />,
    href: "/(forms)/transaction-form",
  },
  {
    title: "Create Hatian",
    icon: <Plus className="text-foreground" />,
    href: "/(forms)/hatian-form",
  },
  {
    title: "Create Group",
    icon: <Plus className="text-foreground" />,
    href: "/(forms)/group-form",
  },
];
