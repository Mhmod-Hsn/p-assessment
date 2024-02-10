import { classToColor } from '@/helpers/classToColor';

export const ClassTitle = (key: string) => {
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
