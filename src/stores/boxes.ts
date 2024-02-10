import { TBox } from '@/types/box';
import { create } from 'zustand';

type BoxesState = {
	boxes: TBox[];
	activeBox: TBox | null;
	setActiveBox: (box: TBox | null) => void;
	setBoxes: (boxes: TBox[]) => void;
	removeBox: (id: string) => void;
};

export const useBoxesStore = create<BoxesState>((set) => ({
	// initial state
	boxes: [],
	activeBox: null,
	// actions
	setBoxes: (boxes: TBox[]) => {
		set({ boxes });
	},
	setActiveBox: (box: TBox | null) => {
		set({ activeBox: box });
	},
	removeBox: (id: string) => {
		set((state) => ({
			boxes: state.boxes.filter((box) => box.id !== id),
		}));
	},
	updateBox: (box: TBox) => {
		set((state) => ({
			boxes: state.boxes.map((b) => (b.id === box.id ? box : b)),
		}));
	},
}));
