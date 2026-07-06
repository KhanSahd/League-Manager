import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Sport } from 'types';

export default function SportIcon({ sport }: { sport: Sport }) {
	switch (sport?.name?.toLowerCase()) {
		case 'soccer':
			return <FontAwesome name="soccer-ball-o" size={24} color="black" />;
		case 'basketball':
			return <FontAwesome6 name="basketball" size={24} color="brown" />;
		case 'baseball':
			return <FontAwesome6 name="baseball-bat-ball" size={24} color="black" />;
		case 'tennis':
			return <Ionicons name="tennisball" size={24} color="#CCFF00" />;
		case 'football':
			return <Ionicons name="american-football" size={24} color="#815337" />;
		case 'esports':
			return <MaterialIcons name="sports-esports" size={24} color="#F13030" />;
		default:
			return <Entypo name="trophy" size={24} color="gold" />;
	}
}
