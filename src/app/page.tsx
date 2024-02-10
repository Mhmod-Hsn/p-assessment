import { CanvasWrapper } from '@/components/CanvasWrapper';
import { Sidebar } from '@/components/Sidebar';
import data from '../data/task-object.json';

export default async function Home() {
	return (
		<main className='w-full h-[100vh] '>
			<Sidebar />
			<CanvasWrapper data={data} />
		</main>
	);
}
