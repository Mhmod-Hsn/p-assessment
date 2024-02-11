'use client';

import useWindowDimensions from '@/hooks/useWindowDimentions';
import { MOBILE_BREAKPOINT } from '@/lib/constants';
import { useBoxesStore } from '@/stores/boxes';
import { TBox } from '@/types/box';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { memo, useLayoutEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { BoxItem } from './Sidebar/BoxItem';
import { ClassTitle } from './Sidebar/ClassTitle';
import { ModeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type DetectedFields = {
	[key: string]: TBox[];
};

export const Sidebar = memo(() => {
	const boxes = useBoxesStore((state) => state.boxes);
	const screenDimentions = useWindowDimensions();

	const [groupedBoxes, setGroupedBoxes] = useState<DetectedFields>({});

	useLayoutEffect(() => {
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
				{Object.keys(groupedBoxes)
					.sort()
					.map((key) => {
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
								{ClassTitle(key)}

								{groupedBoxes[key].map((box, index) => (
									<BoxItem key={index} {...box} />
								))}
							</div>
						);
					})}
			</div>
		);
	};

	const renderSidebarContent = () => (
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

	if (screenDimentions.width > MOBILE_BREAKPOINT) return renderSidebarContent();

	return (
		<Drawer.Root direction='left'>
			<Drawer.Trigger asChild>
				<Button
					variant='outline'
					className='fixed top-4 left-4 z-10  p-2 rounded'
					size='icon'
				>
					<HamburgerMenuIcon />
				</Button>
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className='fixed inset-0 bg-black/40' />
				<Drawer.Content className='w-[300px] fixed top-0 bottom-0 left-0 z-20'>
					{renderSidebarContent()}
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
});
Sidebar.displayName = 'Sidebar';
