import { Provider } from 'react-redux';
import { store } from './redux/store';
import ParentContainer from './navigators/ParentContainer';

export default function App() {
	return (
		<Provider store={store}>
			<ParentContainer />
		</Provider>
	);
}
