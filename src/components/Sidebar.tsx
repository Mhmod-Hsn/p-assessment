'use client';

import { classToColor } from '@/helpers/classToColor';
import { useBoxesStore } from '@/stores/boxes';
import { TBox } from '@/types/box';
import { memo, useEffect, useState } from 'react';

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
		console.log({ grouped });
	}, [boxes]);

	return (
		<div
			className='
        w-[300px]
        p-4
        dark:bg-slate-700'
		>
			{Object.keys(groupedBoxes).map((key) => {
				return (
					<div
						key={key}
						className='
              border
              rounded-md
              mb-4
              ps-2
              hover:dark:bg-slate-600
              '
					>
						{BoxClassTitle(key)}

						{groupedBoxes[key].map((box, index) => (
							<BoxItems key={index} {...box} />
						))}
					</div>
				);
			})}
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
const BoxItems = (box: TBox, index: number) => {
	const setActiveBox = useBoxesStore((state) => state.setActiveBox);
	const onClickHandler = (box: TBox) => {
		setActiveBox(box);
	};

	return (
		<button
			key={`${box.text}-${index}`}
			className='py-1'
			onClick={() => onClickHandler(box)}
		>
			{box.text}
		</button>
	);
};
