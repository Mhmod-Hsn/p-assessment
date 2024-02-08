import { CanvasBoard } from '@/components/CanvasBoard';
import { promises as fs } from 'fs';

export default async function Home() {
	const file = await fs.readFile(
		process.cwd() + '/src/data/task-object.json',
		'utf8'
	);
	const data = JSON.parse(file);

	console.log(data.boxes);
	return (
		<main className='w-full h-[100vh]'>
			{/* <Image src={data.base64} width={200} height={200} alt='image' /> */}
			<CanvasBoard bgImage={data.base64} boxes={data.boxes} />
		</main>
	);
}
