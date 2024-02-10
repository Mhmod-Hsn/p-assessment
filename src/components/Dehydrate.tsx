'use client';

import React, { useEffect } from 'react';

type Props = {
	children: React.ReactNode;
};

export const Dehydrate = ({ children }: Props) => {
	const [isLoaded, setIsLoaded] = React.useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	if (!isLoaded) {
		return null;
	}
	return children;
};
