'use client';

import { Button } from '@/components/ui/button';
import { editBoxFormSchema } from '@/schema/box';
import { useBoxesStore } from '@/stores/boxes';
import { CLASSES } from '@/types/class';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

type Props = {};

export const BoxForm = (props: Props) => {
	const { activeBox, setActiveBox, removeBox, updateBox } = useBoxesStore(
		(state) => state
	);

	const form = useForm<z.infer<typeof editBoxFormSchema>>({
		resolver: zodResolver(editBoxFormSchema),
		defaultValues: {
			text: '',
			class: '',
			points: [0, 0, 0, 0],
			id: '',
		},
	});
	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof editBoxFormSchema>) {
		updateBox(values);
		setActiveBox(null);
	}

	const onDeleteHandler = () => {
		const c = confirm('Are you sure you want to delete this box?');
		if (!c) return;
		if (!activeBox?.id) return;

		removeBox(activeBox.id);
		setActiveBox(null);
	};

	const onCancelHandler = () => {
		setActiveBox(null);
	};

	useEffect(() => {
		if (!activeBox) return;
		form.reset(activeBox);
	}, [activeBox, form]);

	if (!activeBox) return null;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='text'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Text</FormLabel>
							<FormControl>
								<Input placeholder='Text' {...field} />
							</FormControl>
							<FormMessage />
							<FormDescription>Update text value</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='class'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Class</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={activeBox.class}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a class' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{CLASSES.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Select one of the provided classes
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-between gap-1 '>
					<Button
						type='button'
						variant='destructive'
						className='me-auto'
						onClick={onDeleteHandler}
					>
						Delete
					</Button>

					<Button type='button' variant='ghost' onClick={onCancelHandler}>
						Cancle
					</Button>

					<Button type='submit' variant='default'>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};
