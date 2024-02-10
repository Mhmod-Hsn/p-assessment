'use client';
import { isClient } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

function getWindowDimensions() {
	if (!isClient) {
		return { width: 0, height: 0 };
	}
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return useMemo(() => windowDimensions, [windowDimensions]);
}
