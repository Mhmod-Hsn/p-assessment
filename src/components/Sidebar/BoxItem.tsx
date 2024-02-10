import { useBoxesStore } from '@/stores/boxes';
import { TBox } from '@/types/box';
import { Button } from '../ui/button';

export const BoxItem = (box: TBox, index: number) => {
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	const isActive = activeBox?.id === box.id;

	const onClickHandler = (box: TBox) => {
		setActiveBox(isActive ? null : box);
	};

	return (
		<Button
			key={`${box.text}-${index}`}
			className={`
        py-1 block 
        ${isActive && 'bg-slate-200 dark:bg-slate-500'}
      `}
			variant='ghost'
			onClick={() => onClickHandler(box)}
		>
			{box.text}
		</Button>
	);
};
