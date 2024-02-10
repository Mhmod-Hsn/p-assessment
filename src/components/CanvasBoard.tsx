/* eslint-disable @next/next/no-img-element */
'use client';

import { classToColor } from '@/helpers/classToColor';
import useWindowDimensions from '@/hooks/useWindowDimentions';
import { useBoxesStore } from '@/stores/boxes';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { ScrollArea } from './ui/scroll-area';

type Props = {
	bgImage: string;
};

const CanvasBoard = ({ bgImage }: Props) => {
	const boxes = useBoxesStore((state) => state.boxes);
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const screenDimentions = useWindowDimensions();

	const [imgDimentions, setImgDimentions] = useState({
		width: 0,
		height: 0,
	});
	const [containerDimentions, setContainerDimentions] = useState({
		width: 0,
		height: 0,
	});
	const [ratioBetweenContainerAndImage, setRatioBetweenContainerAndImage] =
		useState(0);

	// Memoize the aspect ratio
	const imageAspectRatio = useMemo(
		() => imgDimentions.width / imgDimentions.height,
		[imgDimentions.height, imgDimentions.width]
	);

	const drawBoxes = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		boxes.forEach((box) => {
			console.log('box', box);

			const pts = box.points.map(
				(pt: number) => pt * ratioBetweenContainerAndImage
			);

			ctx.beginPath();
			ctx?.rect(pts[0], pts[1], pts[2] - pts[0], pts[3] - pts[1]);

			ctx.fillStyle = classToColor(box.class);
			ctx.fill();
		});
	}, [boxes, ratioBetweenContainerAndImage]);

	// get image dimentions and calculate aspect ratio
	useLayoutEffect(() => {
		if (!bgImage) return;
		const img = new Image();
		img.src = bgImage;
		img.onload = () => {
			setImgDimentions({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
		};
	}, [bgImage]);

	useEffect(() => {
		if (containerRef?.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setContainerDimentions({
				width: rect.width,
				height: rect.height,
			});
			setRatioBetweenContainerAndImage(rect.width / imgDimentions.width);
			if (canvasRef.current) {
				canvasRef.current.width = rect.width;
				canvasRef.current.height = rect.height;
				drawBoxes();
			}
		}
	}, [drawBoxes, imgDimentions.width, screenDimentions]);

	// const ratioBetweenScreenAndImg = width / img.naturalWidth;

	// const updateCanvasDimensions = useCallback(() => {
	// 	if (!canvasRef.current) return;
	// 	const canvas = canvasRef.current;
	// 	canvas.width = width;
	// 	canvas.height = height;
	// }, [height, width]);

	// useEffect(() => {
	// 	updateCanvasDimensions();
	// }, []);

	useEffect(() => {
		drawBoxes();
	}, [drawBoxes]);

	const renderCanvas = () => {
		return (
			<canvas ref={canvasRef} className='absolute top-0 left-0 z-10 border ' />
		);
	};

	const renderDebugData = () => {
		return (
			<div className='fixed top-4 right-4 z-50 p-3  dark:text-slate-900 backdrop-blur-sm border'>
				<p>
					imgDimentions: {imgDimentions.width}, {imgDimentions.height}
				</p>
				<p>imageAspectRatio: {imageAspectRatio}</p>
				<p>
					containerDimentions: {containerDimentions.width},{' '}
					{containerDimentions.height}
				</p>
				<p>ratioBetweenContainerAndImage: {ratioBetweenContainerAndImage}</p>
			</div>
		);
	};

	return (
		<ScrollArea className='w-full h-full '>
			{renderDebugData()}
			<div ref={containerRef} className='relative'>
				<img className='w-full h-auto' alt='bcakground image' src={bgImage} />
				{renderCanvas()}
			</div>
		</ScrollArea>
	);
};

export default CanvasBoard;
