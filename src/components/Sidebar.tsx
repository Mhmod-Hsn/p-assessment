'use client';

import { classToColor } from '@/helpers/classToColor';
import { useBoxesStore } from '@/stores/boxes';
import { TBox } from '@/types/box';
import { memo, useEffect, useState } from 'react';
import { ModeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type DetectedFields = {
	[key: string]: TBox[];
};

export const Sidebar = memo(() => {
	const boxes = useBoxesStore((state) => state.boxes);
	const [groupedBoxes, setGroupedBoxes] = useState<DetectedFields>({});

	useEffect(() => {
		const grouped: DetectedFields = {};
		boxes.forEach((box) => {
			if (grouped[box.class]) {
				grouped[box.class].push(box);
			} else {
				grouped[box.class] = [box];
			}
		});
		setGroupedBoxes(grouped);
	}, [boxes]);

	const renderBoxesList = () => {
		return (
			<div>
				{Object.keys(groupedBoxes).map((key) => {
					return (
						<div
							key={key}
							className='
              border
              rounded-md
              mb-4
              p-2
              '
						>
							{BoxClassTitle(key)}

							{groupedBoxes[key].map((box, index) => (
								<BoxItem key={index} {...box} />
							))}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div
			className='
				min-w-[300px]
        h-full
        p-4
        dark:bg-slate-700
        
        flex
        flex-col
        justify-between
        gap-4
			'
		>
			<ScrollArea className='h-full'>{renderBoxesList()}</ScrollArea>

			<ModeToggle />
		</div>
	);
});
Sidebar.displayName = 'Sidebar';

const BoxClassTitle = (key: string) => {
	return (
		<div className='flex flex-row items-center gap-2 py-1'>
			<span
				className='w-4 h-4 rounded-full'
				style={{ backgroundColor: classToColor(key) }}
			></span>
			<p
				className='
          text-lg
          font-bold
          '
			>
				{key}
			</p>
		</div>
	);
};
const BoxItem = (box: TBox, index: number) => {
	const { activeBox, setActiveBox } = useBoxesStore((state) => state);

	const onClickHandler = (box: TBox) => {
		setActiveBox(box);
	};

	const isActive = activeBox?.id === box.id;

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
