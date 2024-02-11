import { useBoxesStore } from '@/stores/boxes';
import { BoxForm } from './BoxForm';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// Define Props type for BoxPopover component
type Props = {
	ratioBetweenContainerAndImage: number;
};

// Define constants for popover offset
const offsetX = 0;
const offsetY = 10;

// Define BoxPopover component
export const BoxPopover = ({ ratioBetweenContainerAndImage }: Props) => {
	// Fetch activeBox and setActiveBox function using custom hook
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	// Render null if no active box
	if (!activeBox) return null;

	// Render BoxPopover component
	return (
		<>
			<Popover
				open={!!activeBox}
				onOpenChange={(isOpen) => {
					if (!isOpen) setActiveBox(null);
				}}
			>
				<PopoverTrigger
					style={{
						position: 'absolute',
						left:
							((activeBox.points[2] + activeBox.points[0]) *
								ratioBetweenContainerAndImage) /
								2 +
							offsetX,
						top:
							((activeBox.points[3] + activeBox.points[1]) *
								ratioBetweenContainerAndImage) /
								2 +
							offsetY,
					}}
				/>
				<PopoverContent style={{ marginBottom: '20px' }}>
					<BoxForm />
				</PopoverContent>
			</Popover>
		</>
	);
};
