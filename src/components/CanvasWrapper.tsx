'use client';

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
		setBoxes(data.boxes);
	}, [data.boxes, setBoxes]);

	return <CanvasBoard bgImage={data.base64} />;
};
