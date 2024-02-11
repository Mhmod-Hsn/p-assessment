import { CanvasWrapper } from '@/components/CanvasWrapper';
import { Dehydrate } from '@/components/Dehydrate';
import { Sidebar } from '@/components/Sidebar';
import { uuid } from '@/helpers/uuid';
import { TBox } from '@/types/box';
import data from '../data/task-object.json';

export default async function Home() {
	const boxesWithId: TBox[] = [...data.boxes].map((box) => {
		return {
			...box,
			id: uuid(),
		};
	});

	return (
		<main className='w-full h-[100vh] flex '>
			<Dehydrate>
				<Sidebar />
			</Dehydrate>
			<CanvasWrapper data={{ ...data, boxes: boxesWithId }} />
		</main>
	);
}
