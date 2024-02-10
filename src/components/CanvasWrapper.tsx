'use client';

import { uuid } from '@/helpers/uuid';
import { useBoxesStore } from '@/stores/boxes';
import { TFile } from '@/types/file';
import dynamic from 'next/dynamic';
import { Sidebar } from './Sidebar';

const CanvasBoard = dynamic(() => import('./CanvasBoard'), { ssr: false });

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
			{/* <CanvasBoard bgImage={data.base64} /> */}
		</div>
	);
};
