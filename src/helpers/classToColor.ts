import { TClass } from '@/types/class';

export const classToColor = (className: TClass) => {
	switch (className) {
		case 'Name':
			return 'blue';
		case 'Description':
			return 'green';
		case 'Date':
			return 'red';
		case 'Amount':
			return 'yellow';
		case 'Supplier':
			return 'purple';
		case 'Number':
			return 'pink';
		default:
			return 'gray';
	}
};
