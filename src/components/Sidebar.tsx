'use client';

import { classToColor } from '@/helpers/classToColor';
import { TBox } from '@/types/box';
import { useEffect, useState } from 'react';

type Props = {
	boxes: TBox[];
};
type DetectedFields = {
	[key: string]: TBox[];
};
export const Sidebar = ({ boxes }: Props) => {
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
						{renderBoxClassTitle(key)}

						{groupedBoxes[key].map((box, index) => renderBoxItems(box, index))}
					</div>
				);
			})}
		</div>
	);
};

const renderBoxClassTitle = (key: string) => {
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
const renderBoxItems = (box: TBox, index: number, onClick?: () => void) => {
	return (
		<div key={`${box.text}-${index}`} className='py-1' onClick={onClick}>
			{box.text}
		</div>
	);
};
