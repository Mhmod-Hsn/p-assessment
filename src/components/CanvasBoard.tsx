'use client';

import { classToColor } from '@/helpers/classToColor';
import useWindowDimensions from '@/hooks/useWindowDimentions';
import { TBox } from '@/types/box';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
	bgImage: string;
	boxes: TBox[];
};

const CanvasBoard = ({ bgImage, boxes }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [aspectRatio, setAspectRatio] = useState<number>(1);
	const dimentions = useWindowDimensions();
	const [img, setImg] = useState<HTMLImageElement>(new Image());
	const width = Math.min(dimentions.height * aspectRatio, dimentions.width);
	const height = Math.min(dimentions.width / aspectRatio, dimentions.height);
	const ratioBetweenScreenAndImg = width / img.naturalWidth;

	const updateCanvasDimensions = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		canvas.width = width;
		canvas.height = height;
	}, [height, width]);

	const loadImg = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		const img = new Image();
		img.src = bgImage;
		setImg(img);

		setAspectRatio(img.naturalWidth / img.naturalHeight || 1);
	}, [bgImage]);

	const drawBG = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.drawImage(img, 0, 0, width, height);
	}, [img, width, height]);

	const drawBoxes = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		boxes.forEach((box) => {
			// rescale points with the ratio between screen and image
			const pts = box.points.map((pt: number) => pt * ratioBetweenScreenAndImg);

			ctx.beginPath();
			ctx?.rect(pts[0], pts[1], pts[2] - pts[0], pts[3] - pts[1]);

			ctx.fillStyle = classToColor(box.class);
			ctx.fill();
		});
	}, [boxes, ratioBetweenScreenAndImg]);

	useEffect(() => {
		loadImg();
		updateCanvasDimensions();
	}, [loadImg, updateCanvasDimensions]);

	useEffect(() => {
		drawBG();
		drawBoxes();
	}, [dimentions, drawBG, drawBoxes]);

	return (
		<div>
			<canvas
				ref={canvasRef}
				className=' border-spacing-2 border border-green-500 w-100'
				style={{
					maxWidth: '100vw',
					maxHeight: '100vh',
					aspectRatio: aspectRatio,
				}}
			/>
		</div>
	);
};

export default CanvasBoard;
