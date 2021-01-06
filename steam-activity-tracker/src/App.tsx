import React from 'react';
import './App.css';
import { AddSteamAccount } from './components/add-account/add-account'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Home } from '../src/components/home/home';
function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link to="/">
            <a className="navbar-brand">Home</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </Link>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link to="/addaccount">
                  <a className="nav-link">Add Steam Account<span className="sr-only">(current)</span></a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/addaccount">
            <AddSteamAccount />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router >
  );
}



export default App;
