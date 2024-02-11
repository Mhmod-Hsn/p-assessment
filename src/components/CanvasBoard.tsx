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
	// Fetch boxes and setActiveBox function using custom hook
	const boxes = useBoxesStore((state) => state.boxes);
	const setActiveBox = useBoxesStore((state) => state.setActiveBox);

	const screenDimensions = useWindowDimensions();

	// Refs for canvas and container
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [img, setImg] = useState<CanvasImageSource | null>(null);
	// Dimensions and ratio states
	const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
	const [containerDimensions, setContainerDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [ratioBetweenContainerAndImage, setRatioBetweenContainerAndImage] =
		useState(0);

	// Calculate image aspect ratio
	const imageAspectRatio = useMemo(
		() => imgDimensions.width / imgDimensions.height,
		[imgDimensions]
	);

	const clearCanvas = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear previous drawings
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}, []);

	// Draw boxes on the canvas
	const drawBoxes = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Draw each box
		boxes.forEach((box) => {
			const pts = box.points.map(
				(pt: number) => pt * ratioBetweenContainerAndImage
			);

			// Draw the box
			ctx.beginPath();
			ctx.rect(pts[0], pts[1], pts[2] - pts[0], pts[3] - pts[1]);
			ctx.fillStyle = classToColor(box.class);
			ctx.fill();

			// Draw the text
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = `bold ${ratioBetweenContainerAndImage}rem sans-serif`;
			ctx.fillText(box.text, (pts[0] + pts[2]) / 2, (pts[1] + pts[3]) / 2);
		});
	}, [boxes, ratioBetweenContainerAndImage]);

	const drawImage = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx || !img) return;

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}, [img]);

	// Load image dimensions
	useLayoutEffect(() => {
		if (!bgImage) return;
		const img = new Image();
		img.src = bgImage;
		img.onload = () => {
			setImg(img);
			setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
		};
	}, [bgImage]);

	// Update dimensions and draw boxes on resize
	useEffect(() => {
		if (!containerRef?.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		console.log(containerRef.current.getBoundingClientRect().width);
		setContainerDimensions({ width: rect.width, height: rect.height });
		setRatioBetweenContainerAndImage(rect.width / imgDimensions.width);

		if (!canvasRef?.current) return;
		canvasRef.current.width = rect.width;
		canvasRef.current.height = rect.height;

		clearCanvas();
		drawImage();
		drawBoxes();
	}, [
		drawBoxes,
		imgDimensions.width,
		containerDimensions.width,
		clearCanvas,
		drawImage,
		screenDimensions,
	]);

	// Handle double-click event to activate box
	const onDblClickHandler = useCallback(
		(e: MouseEvent) => {
			if (!canvasRef.current) return;
			const element = detectElementAreaClick(
				e,
				boxes,
				ratioBetweenContainerAndImage
			);
			if (element) setActiveBox(element);
		},
		[boxes, ratioBetweenContainerAndImage, setActiveBox]
	);

	// Add double-click event listener
	useEffect(() => {
		const ref = canvasRef.current;
		if (!ref) return;

		ref.addEventListener('dblclick', onDblClickHandler);

		return () => {
			ref.removeEventListener('dblclick', onDblClickHandler);
		};
	}, [onDblClickHandler]);

	// Render canvas
	const renderCanvas = () => (
		<canvas
			ref={canvasRef}
			className='cursor-pointer'
			style={{
				userSelect: 'none',
				width: '100%',
				height: containerDimensions.width / imageAspectRatio,
			}}
		/>
	);

	const renderDebugData = () => {
		return (
			<div className='fixed top-4 right-4 z-50 p-3  dark:text-slate-900 backdrop-blur-sm border'>
				<p>
					imgDimensions: {imgDimensions.width}, {imgDimensions.height}
				</p>
				<p>imageAspectRatio: {imageAspectRatio}</p>
				<p>
					containerDimensions: {containerDimensions.width},
					{containerDimensions.height}
				</p>
				<p>ratioBetweenContainerAndImage: {ratioBetweenContainerAndImage}</p>
			</div>
		);
	};

	// Render the component
	return (
		<ScrollArea className='w-full h-full'>
			{renderDebugData()}
			<div ref={containerRef} className='relative'>
				{/* <img className='w-full h-auto' alt='background image' src={bgImage} /> */}
				{renderCanvas()}
				<BoxPopover
					ratioBetweenContainerAndImage={ratioBetweenContainerAndImage}
				/>
			</div>
		</ScrollArea>
	);
};

export default CanvasBoard;
