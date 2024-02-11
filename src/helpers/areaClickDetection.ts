import { TBox } from '@/types/box';

export const detectElementAreaClick = (
	event: MouseEvent,
	boxes: TBox[],
	ratioBetweenContainerAndImage: number
) => {
	const { offsetX: x, offsetY: y } = event;

	for (let index = 0; index < boxes.length; index++) {
		const element = boxes[index];
		const elementPoints = element.points.map(
			(point: number) => point * ratioBetweenContainerAndImage
		);
		if (
			elementPoints[0] < x &&
			elementPoints[2] > x &&
			elementPoints[1] < y &&
			elementPoints[3] > y
		) {
			return element;
		}
	}
	return null;
};
