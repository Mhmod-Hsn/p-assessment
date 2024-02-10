'use client';

import { uuid } from '@/helpers/uuid';
import { TFile } from '@/types/file';
import dynamic from 'next/dynamic';
import { Sidebar } from './Sidebar';

const CanvasBoard = dynamic(() => import('@/components/CanvasBoard'), {
	ssr: false,
});

type Props = {
	data: TFile;
};

export const CanvasWrapper = ({ data }: Props) => {
	const boxes = data.boxes.map((box) => {
		return {
			...box,
			id: uuid(),
		};
	});
	return (
		<div className='flex flex-row'>
			{/* Sidebar */}
			<Sidebar boxes={boxes} />
			<CanvasBoard bgImage={data.base64} boxes={data.boxes} />
		</div>
	);
};
