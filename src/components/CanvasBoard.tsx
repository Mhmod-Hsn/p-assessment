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

	// Draw boxes on the canvas
	const drawBoxes = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear previous drawings
		ctx.clearRect(0, 0, canvas.width, canvas.height);

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

	// Load image dimensions
	useLayoutEffect(() => {
		if (!bgImage) return;
		const img = new Image();
		img.src = bgImage;
		img.onload = () => {
			setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
		};
	}, [bgImage]);

	// Update dimensions and draw boxes on resize or image load
	useEffect(() => {
		if (containerRef?.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setContainerDimensions({ width: rect.width, height: rect.height });
			setRatioBetweenContainerAndImage(rect.width / imgDimensions.width);

			if (canvasRef.current) {
				canvasRef.current.width = rect.width;
				canvasRef.current.height = rect.height;
				drawBoxes();
			}
		}
	}, [drawBoxes, imgDimensions.width, containerDimensions.width]);

	// Update dimensions and draw boxes on resize
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
			className='absolute top-0 left-0 cursor-pointer'
			style={{ userSelect: 'none' }}
		/>
	);

	// Render the component
	return (
		<ScrollArea className='w-full h-full'>
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
