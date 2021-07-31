import React from 'react';
import Navbar from './Components/Navbar';
import Homepage from './Homepage';
import ChatRoom from './ChatRoom';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
	//===============
	// JSX
	//===============
	return (
	<BrowserRouter>
		<div className='min-h-screen max-h-screen flex flex-col'>
			<Navbar />
			<Switch>
				<Route exact path='/'>
					<Homepage />
				</Route>
				<Route exact path='/chat/:username'>
					<ChatRoom />
				</Route>
			</Switch>
		</div>
	</BrowserRouter>
	);
}

export default App;
