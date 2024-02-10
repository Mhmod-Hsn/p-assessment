'use client';

import { uuid } from '@/helpers/uuid';
import { useBoxesStore } from '@/stores/boxes';
import { TFile } from '@/types/file';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const CanvasBoard = dynamic(() => import('./CanvasBoard'), { ssr: false });

type Props = {
	data: TFile;
};

export const CanvasWrapper = ({ data }: Props) => {
	const setBoxes = useBoxesStore((state) => state.setBoxes);
	useEffect(() => {
		const mutatedBoxes = data.boxes.map((box) => {
			return {
				...box,
				id: uuid(),
			};
		});
		setBoxes(mutatedBoxes);
	}, [data.boxes, setBoxes]);

	return <CanvasBoard bgImage={data.base64} />;
};
