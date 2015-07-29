'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {RouteHandler} from 'react-router';

// Components
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import GoogleAnalytics from 'react-ga';
import List from '../Widgets/List';

// Actions
import UserActions from '../../actions/UserActions';

// Stores
import AppStore from '../../stores/AppStore';
import UserStore from '../../stores/UserStore';

function authenticate(callback) {
    let parameters = {
        callback: callback
    };

    UserActions.getUserDetails(parameters);
}

function getInitialState() {
    return {
        users: undefined
    };
}

function getStateFromStores() {
    return UserStore.getUserAndRole();
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = getInitialState();

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this.onChange = () => {
            let newState = getStateFromStores();
            if (newState != null) {
                this.setState(newState);
            }
        };

        this.onLoginSubmit = (error) => {
            error.preventDefault();
            let email = React.findDOMNode(this.refs.email).value.trim();
            let password = React.findDOMNode(this.refs.password).value.trim();

            let parameters = {
                email: email,
                password: password
            };

            UserActions.loginSubmit(parameters);
        };
    }

    componentDidMount() {
        AppStore.listen(this.onAlert);
        UserStore.listen(this.onChange);
    }

    componentWillMount() {
        this.onChange();
    }

    componentWillUnmount() {
        AppStore.unlisten(this.onAlert);
        UserStore.unlisten(this.onChange);
    }

    /**
     * @return {object}
     */
    render() {
        //TODO: Refactor for easy hide/show login form based on logged in status
        const userAuth = (
            <form className="navbar-form navbar-right" onSubmit={this.onLoginSubmit}>
                <input className="form-control" type="email" placeholder="Email Address" required ref="email"/>
                <input className="form-control" type="password" placeholder="Password" required ref="password"/>
                <input className="btn btn-primary" type="submit" value="Login"/>
            </form>
        );
        const userDetails = (
            <span>Welcome! {this.state.user ? this.state.user.name : ''}</span>
        );
        return (
            <div>
                <Navbar brand='React App Starter' staticTop toggleNavKey={0}>
                    <Nav right eventKey={0}> {/* This is the eventKey referenced */}
                        <NavItem>
                            {this.state.user ? userDetails : userAuth}
                        </NavItem>
                        <NavItem eventKey={1} href='http://stevetan.me'>Blog</NavItem>
                    </Nav>
                </Navbar>
                <main className='container-fluid'>
                    <RouteHandler {...this.props}/>
                </main>
                <footer className='container-fluid'>
                    <div className='row'>
                        <hr />
                        <section>
                            <span>Footer Section 1</span>
                        </section>

                        <section>
                            <span>Footer Section 2</span>
                        </section>

                        <section>
                            <span>Footer Section 3</span>
                        </section>
                    </div>
                </footer>
            </div>
        );
    }

    /**
     * Static method to trigger data actions for server-side rendering.
     *
     * @param routerState
     * @returns {*}
     */
    static fetchData(routerState, callback) {
        //TODO: No longer needed? Do not populate on first call to server, only after first request?
        authenticate(callback);
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    onAlert() {
        _.forEach(AppStore.getPendingAlerts(), (alertPayload) => {
            console.log(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
            window.alert(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
        });
    }
}

export default App;
