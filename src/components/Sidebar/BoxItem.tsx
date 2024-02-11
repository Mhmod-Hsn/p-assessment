import { useBoxesStore } from '@/stores/boxes';
import { TBox } from '@/types/box';
import { Button } from '../ui/button';

// Define BoxItem component
export const BoxItem = ({ box }: { box: TBox }) => {
	// Fetch active box and setActiveBox function using custom hook
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	// Check if the current box is active
	const isActive = activeBox?.id === box.id;

	// Handler for box click event
	const onClickHandler = (box: TBox) => {
		setActiveBox(isActive ? null : box);
	};

	// Render BoxItem component
	return (
		<Button
			key={`${box.id}`}
			className={`py-1 block ${isActive && 'bg-slate-200 dark:bg-slate-500'}`}
			variant='ghost'
			onClick={() => onClickHandler(box)}
		>
			{box.text}
		</Button>
	);
};
