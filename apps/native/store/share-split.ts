import { create } from "zustand";

interface SelectedShareFieldStore {
	selectedShareField: number | null;
	setSelectedShareField: (selectedShareField: number | null) => void;
}

const useSelectedShareFieldStore = create<SelectedShareFieldStore>((set) => ({
	selectedShareField: null,
	setSelectedShareField: (selectedShareField) => set({ selectedShareField }),
}));

export default useSelectedShareFieldStore;
