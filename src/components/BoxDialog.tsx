'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useBoxesStore } from '@/stores/boxes';
import { BoxForm } from './BoxForm';

export const BoxInfoDialog = () => {
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	if (!activeBox) return null;

	return (
		<Dialog
			open={!!activeBox}
			onOpenChange={(isOpen) => {
				if (!isOpen) setActiveBox(null);
			}}
		>
			<DialogContent className='sm:max-w-md'>
				<BoxForm />
			</DialogContent>
		</Dialog>
	);
};
