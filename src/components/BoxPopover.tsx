import { useBoxesStore } from '@/stores/boxes';
import { BoxForm } from './BoxForm';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type Props = {
	ratioBetweenContainerAndImage: number;
};

const offsetX = 0;
const offsetY = 10;

export const BoxPopover = ({ ratioBetweenContainerAndImage }: Props) => {
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	if (!activeBox) return null;

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
