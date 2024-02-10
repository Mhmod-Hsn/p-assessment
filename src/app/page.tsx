import { CanvasWrapper } from '@/components/CanvasWrapper';
import data from '../data/task-object.json';

export default async function Home() {
	return (
		<main className='w-full h-[100vh] '>
			<CanvasWrapper data={data} />
		</main>
	);
}
