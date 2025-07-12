import { create } from "zustand";

interface memberIndexStore {
	memberIndex: number;
	setMemberIndex: (memberIndex: number) => void;
}

const useMemberIndexStore = create<memberIndexStore>((set) => ({
	memberIndex: -1,
	setMemberIndex: (memberIndex) => set({ memberIndex }),
}));

export default useMemberIndexStore;
