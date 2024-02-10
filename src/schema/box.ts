'use client';

import { z } from 'zod';

export const editBoxFormSchema = z.object({
	class: z.string().min(1).max(30),
	text: z.string().min(1).max(30),
	id: z.string(),
	points: z.array(z.number()).length(4),
});
