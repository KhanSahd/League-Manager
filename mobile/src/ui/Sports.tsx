import { View, Text, Platform } from 'react-native';
import React from 'react';
import { TriggerRef } from '@rn-primitives/select';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from './select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setSelectedSport } from '@/redux/slices/SportsSlice';
import { Sport } from 'types';

interface ChildProps {
	onDataChange: (sport: Sport | null) => void;
}

const Sports = ({ onDataChange, currentSport }: ChildProps & { currentSport: Sport | null }) => {
	const ref = React.useRef<TriggerRef>(null);
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
		left: 12,
		right: 12,
	};
	const sports = useAppSelector((state) => state.sports.sports);

	return (
		<Select
			onValueChange={(option) => {
				const Sport = sports?.find((s) => s.id === option?.value);
				onDataChange(Sport ?? null);
			}}
			value={currentSport ? { label: currentSport.name, value: currentSport.id } : undefined}
		>
			<SelectTrigger ref={ref}>
				<SelectValue placeholder="Select a sport" />
			</SelectTrigger>
			<SelectContent insets={contentInsets}>
				<SelectGroup>
					<SelectLabel>Sports</SelectLabel>
					{sports?.map((sport) => (
						<SelectItem key={sport.id} label={sport.name} value={sport.id}>
							{sport.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default Sports;
