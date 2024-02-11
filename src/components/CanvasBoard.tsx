/* eslint-disable @next/next/no-img-element */
import { detectElementAreaClick } from '@/helpers/areaClickDetection';
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
import { BoxPopover } from './BoxPopover';
import { ScrollArea } from './ui/scroll-area';

type Props = {
	bgImage: string;
};

const CanvasBoard = ({ bgImage }: Props) => {
	const boxes = useBoxesStore((state) => state.boxes);
	const setActiveBox = useBoxesStore((state) => state.setActiveBox);
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const screenDimensions = useWindowDimensions();

	const [imgDimensions, setImgDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [containerDimensions, setContainerDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [ratioBetweenContainerAndImage, setRatioBetweenContainerAndImage] =
		useState(0);

	const imageAspectRatio = useMemo(
		() => imgDimensions.width / imgDimensions.height,
		[imgDimensions.height, imgDimensions.width]
	);

	const drawBoxes = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		boxes.forEach((box) => {
			const pts = box.points.map(
				(pt: number) => pt * ratioBetweenContainerAndImage
			);

			// draw the box
			ctx.beginPath();
			ctx?.rect(pts[0], pts[1], pts[2] - pts[0], pts[3] - pts[1]);
			ctx.fillStyle = classToColor(box.class);
			ctx.fill();

			// draw the text
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = `bold ${ratioBetweenContainerAndImage}rem  sans-serif`;
			ctx.fillText(box.text, (pts[0] + pts[2]) / 2, (pts[1] + pts[3]) / 2);
		});
	}, [boxes, ratioBetweenContainerAndImage]);

	useLayoutEffect(() => {
		if (!bgImage) return;
		const img = new Image();
		img.src = bgImage;
		img.onload = () => {
			setImgDimensions({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
		};
	}, [bgImage]);

	useEffect(() => {
		if (containerRef?.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setContainerDimensions({
				width: rect.width,
				height: rect.height,
			});
			setRatioBetweenContainerAndImage(rect.width / imgDimensions.width);
			if (canvasRef.current) {
				canvasRef.current.width = rect.width;
				canvasRef.current.height = rect.height;
				drawBoxes();
			}
		}
	}, [drawBoxes, imgDimensions.width, screenDimensions]);

	useEffect(() => {
		drawBoxes();
	}, [drawBoxes]);
	const onDblClickHandler = useCallback(
		(e: MouseEvent) => {
			if (!canvasRef.current) return;
			const element = detectElementAreaClick(
				e,
				boxes,
				ratioBetweenContainerAndImage
			);
			if (!element) return;
			setActiveBox(element);
		},
		[boxes, ratioBetweenContainerAndImage, setActiveBox]
	);

	// double click event listener
	useEffect(() => {
		const ref = canvasRef.current;
		if (!ref) return;
		ref.addEventListener('dblclick', onDblClickHandler);

		return () => {
			if (!ref) return;
			ref.removeEventListener('dblclick', onDblClickHandler);
		};
	}, [onDblClickHandler]);

	const renderCanvas = () => (
		<canvas
			ref={canvasRef}
			className='absolute top-0 left-0 cursor-pointer'
			style={{
				userSelect: 'none',
			}}
		/>
	);

	const renderDebugData = () => (
		<div className='fixed top-4 right-4 z-50 p-3 dark:text-slate-900 backdrop-blur-sm border'>
			<p>
				imgDimensions: {imgDimensions.width}, {imgDimensions.height}
			</p>
			<p>imageAspectRatio: {imageAspectRatio}</p>
			<p>
				containerDimensions: {containerDimensions.width},{' '}
				{containerDimensions.height}
			</p>
			<p>ratioBetweenContainerAndImage: {ratioBetweenContainerAndImage}</p>
		</div>
	);

	return (
		<ScrollArea className='w-full h-full'>
			{/* {renderDebugData()} */}
			<div ref={containerRef} className='relative'>
				<img className='w-full h-auto' alt='background image' src={bgImage} />
				{renderCanvas()}
				<BoxPopover
					ratioBetweenContainerAndImage={ratioBetweenContainerAndImage}
				/>
			</div>
		</ScrollArea>
	);
};

export default CanvasBoard;
