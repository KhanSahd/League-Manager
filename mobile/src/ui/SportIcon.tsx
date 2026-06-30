import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SportIcon({ sport }: { sport: string }) {
  switch (sport.toLowerCase()) {
    case "soccer":
      return <FontAwesome name="soccer-ball-o" size={24} color="white" />;
    case "basketball":
        return <FontAwesome6 name="basketball" size={24} color="brown" />;
    case "baseball":
        return <FontAwesome6 name="baseball-bat-ball" size={24} color="black" />;
    case "tennis":
        return <Ionicons name="tennisball" size={24} color="green" />
      default:
          if ( sport.toLowerCase().includes("2k") || sport.toLowerCase().includes("nba") ) {
              return <MaterialIcons name="2k" size={24} color="red" />
          }
        return <Entypo name="trophy" size={24} color="gold" />;
  }
}