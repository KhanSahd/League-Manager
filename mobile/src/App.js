import { Provider } from 'react-redux';
import { store } from './redux/store';
import ParentContainer from './navigators/ParentContainer';
import '../global.css';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

export default function App() {
	return (
		<Provider store={store}>
			<ParentContainer />
		</Provider>
	);
}
