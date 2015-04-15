'use strict';

// React
import React from 'react';

// Libraries
import assign from 'object-assign';
import {Link, RouteHandler} from 'react-router';

// Actions
import AppActions from '../../../actions/AppActions';
import UserActions from '../../../actions/UserActions';

// Stores
import UserStore from '../../../stores/UserStore';

function getStateFromStores(parameters) {
    let user = UserStore.get(parameters.user.id);

    return (user == null) ? null : {
        isLoadingMoreDetails: false,
        user: user
    };
}

function fireActions(state, callback) {
    UserActions.getUser(state.user.id, ['id', 'name', 'gender'], callback);
}

/**
 * User Widget shows a quick user summary.
 *
 * It does not support server side rendering
 * but you can use a parent object to pass
 * it the server state.
 */
class Widget extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = {
            isFirstLoad: true,
            isLoadingMoreDetails: false,
            user: props
        };

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this._onChange = () => {
            let parameters = {
                user: {
                    id: this.state.user.id
                }
            };
            let newState = getStateFromStores(parameters);

            if (newState != null) {
                this.setState(newState);
            }
        };

        /**
         * Event handler for 'button click' events coming from the button
         */
        this._onButtonClick = () => {
            this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true, isFirstLoad: false}), () => {
                fireActions(this.state);
            }); // Set isLoadingMoreDetails to true
        };
    }

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);

        //fireActions(this.state);
    }

    componentWillUnmount() {
        console.log('User Widget will unmount!');
        UserStore.removeChangeListener(this._onChange);
    }

    /**
     * @return {object}
     */
    render() {
        let userDetails;

        if (this.state.isLoadingMoreDetails === true) {
            userDetails = (
                <p><span>Loading more details...</span></p>
            );
        } else {
            if (this.state.user.gender != null && this.state.isFirstLoad !== true) {
                userDetails = (
                    <p><span>{this.state.user.name} is {this.state.user.gender}!</span></p>
                );
            } else {
                userDetails = (
                    <p><button onClick={this._onButtonClick}>Get more user details!</button></p>
                );
            }
        }

        return (
            <div key={this.state.user.id}>
                <h3>{this.state.user.name}</h3>
                {userDetails}
                <hr/>
                <Link to="user-details" params={{id: this.state.user.id}}/>
            </div>
        );
    }
}

Widget.contextTypes = {
    router: React.PropTypes.func.isRequired
};

Widget.propTypes = {
    data: React.PropTypes.object,
    id: (props, propName, componentName) => {
        // Only required if data doesn't exist
        if (props['data'] == null) {
            return React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.number
            ]).isRequired(props, propName, componentName);
        }
    }
};

export default Widget;
