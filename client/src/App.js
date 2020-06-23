import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from './components/cart/cart.js';
import Menu from './components/menu/menu.js';
import Orders from './components/orders/orders.js';
import Order from './components/order/order.js';
import PairingPage from './components/pairingPage/pairingPage.js';
import EditMenuItemPage from './components/editMenuItemPage/editMenuItemPage.js';
import SignupLogin from './components/signupLogin/signupLogin.js';
import logo from './dronuts_logo.png';
import order from './orders.png';
import person from './person.png';
import menu from './menu.png';
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import {Navbar} from 'react-bootstrap'

const App = () => {
	const [value, setValue] = React.useState(localStorage.getItem('myValueInLocalStorage') || "false");

	React.useEffect(() => {
		localStorage.setItem('myValueInLocalStorage', value);
	}, [value]);

	const login = () => setValue("employee");
	const logout = () => setValue("false");

	const menuPage = (props) => {
		return (
			<Menu/>
		);
	};

	const cartPage = (props) => {
		return (
			<Cart/>
		);
	};

	const ordersPage = (props) => {
		return (
			<Orders/>
		);
	};

	const orderPage = (props) => {
		return (
			<Order/>
		);
	};

	const signupLogin = (props) => {
		return (
			<SignupLogin
				login={login}
				logout={logout}
				user={value}/>
		);
	};

	return (
		<div>
			<Router>
				<div className="App">
					<div>
						<Navbar>
							<Navbar.Brand href="/"><img src={logo} width="230px" height="80px" alt=""/></Navbar.Brand>
							<Navbar.Toggle />
							{value === "false" ?
								<Navbar.Collapse className="justify-content-end">
									<Navbar.Text>
										<a href="/order"><img src={order} width="50px" height="50px" alt=""/></a>
										<a href="/"><img src={menu} width="65px" height="65px" alt=""/></a>
									</Navbar.Text>
								</Navbar.Collapse>
								:
								<Navbar.Collapse className="justify-content-end">
									<Navbar.Text>
										<a href="/orders"><img src={order} width="50px" height="50px" alt=""/></a>
										<a href="/menu"><img src={menu} width="65px" height="65px" alt=""/></a>
										<a href="/signupLogin"><img src={person} width="40px" height="65px" alt=""/></a>
									</Navbar.Text>
								</Navbar.Collapse>
							}
						</Navbar>
					</div>
					{value === "false" ?
						<Route path="/" exact strict render={cartPage}/>
						:
						(<div><Route path="/" exact strict render={menuPage}/>
							<Route path="/menu" exact strict render={menuPage}/>
							<Route path="/orders" exact strict render={ordersPage}/>
							<Route path="/editMenuItemPage" exact strict render={(props) => <EditMenuItemPage {...props}/>}/></div>)
					}
					<Route path="/pairingPage" exact strict render={(props) => <PairingPage {...props}/>}/>
					<Route path="/signupLogin" exact strict render={signupLogin}/>
					<Route path="/order" exact strict render={orderPage}/>

				</div>
			</Router>
		</div>
	)
};

export default App;
