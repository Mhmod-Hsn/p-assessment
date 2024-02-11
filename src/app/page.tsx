import { CanvasWrapper } from '@/components/CanvasWrapper';
import { Dehydrate } from '@/components/Dehydrate';
import { Sidebar } from '@/components/Sidebar';
import { uuid } from '@/helpers/uuid';
import { TBox } from '@/types/box';
import data from '../data/task-object.json';

export default async function Home() {
	// Generate unique IDs for each box
	const boxesWithId: TBox[] = [...data.boxes].map((box) => {
		return {
			...box,
			id: uuid(), // Assign a unique ID to each box
		};
	});

	// Render the home page with sidebar and canvas wrapper
	return (
		<main className='w-full h-[100vh] flex '>
			<Dehydrate>
				<Sidebar /> {/* Render the Sidebar component */}
			</Dehydrate>
			{/* Render the CanvasWrapper component with updated data */}
			<CanvasWrapper data={{ ...data, boxes: boxesWithId }} />
		</main>
	);
}
