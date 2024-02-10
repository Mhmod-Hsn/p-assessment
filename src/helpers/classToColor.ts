export const classToColor = (className: string) => {
	switch (className) {
		case 'Name':
			return 'darkred';
		case 'Description':
			return 'green';
		case 'Date':
			return 'red';
		case 'Amount':
			return 'darkblue';
		case 'Supplier':
			return 'purple';
		case 'Number':
			return 'black';
		default:
			return 'gray';
	}
};
