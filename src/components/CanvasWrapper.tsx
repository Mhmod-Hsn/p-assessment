'use client';

import { uuid } from '@/helpers/uuid';
import { useBoxesStore } from '@/stores/boxes';
import { TFile } from '@/types/file';
import CanvasBoard from './CanvasBoard';
import { Sidebar } from './Sidebar';

type Props = {
	data: TFile;
};

export const CanvasWrapper = ({ data }: Props) => {
	const setBoxes = useBoxesStore((state) => state.setBoxes);
	const mutatedBoxes = data.boxes.map((box) => {
		return {
			...box,
			id: uuid(),
		};
	});
	setBoxes(mutatedBoxes);

	return (
		<div className='flex flex-row'>
			{/* Sidebar */}
			<Sidebar />
			<CanvasBoard bgImage={data.base64} />
		</div>
	);
};
