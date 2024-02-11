'use client';

// Import necessary dependencies
import { useBoxesStore } from '@/stores/boxes';
import { TFile } from '@/types/file';
import dynamic from 'next/dynamic';
import { memo, useEffect } from 'react';

// Dynamically import CanvasBoard component to ensure client-side rendering only
const CanvasBoard = dynamic(() => import('./CanvasBoard'), { ssr: false });

// Define Props type for CanvasWrapper component
type Props = {
	data: TFile;
};

// Define CanvasWrapper component
export const CanvasWrapper = memo(({ data }: Props) => {
	// Fetch setBoxes function using custom hook
	const setBoxes = useBoxesStore((state) => state.setBoxes);

	// Effect to set boxes when data.boxes changes
	useEffect(() => {
		setBoxes(data.boxes);
	}, [data.boxes, setBoxes]);

	// Render CanvasBoard component with background image from data
	return <CanvasBoard bgImage={data.base64} />;
});

CanvasWrapper.displayName = 'CanvasWrapper';
