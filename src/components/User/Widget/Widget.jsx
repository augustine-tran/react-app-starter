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

function getStateFromStores(previousState) {
    let user = UserStore.get(previousState.user.id);

    return (user == null) ? null : {
        isLoadingMoreDetails: false,
        user: user
    };
}

function fireActions(state, callback) {
    UserActions.getUser(state.user.id, callback);
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
            isLoadingMoreDetails: false,
            user: props
        };

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this._onChange = () => {
            let newState = getStateFromStores(this.state);

            if (newState != null) {
                console.log(`Setting state for widget #${this.state.user.id} - New state: ${JSON.stringify(newState)}`);
                this.setState(newState);
            }
        };

        /**
         * Event handler for 'button click' events coming from the button
         */
        this._onButtonClick = () => {
            this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true}), () => {
                console.log(`Fire event for widget #${this.state.user.id}`);
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
            if (this.state.user.gender != null) {
                userDetails = (
                    <p><span>{this.state.user.name} is {this.state.user.gender}!</span></p>
                );
            } else {
                userDetails = (
                    <p><button onClick={this._onButtonClick}>Get more user details!</button></p>
                );
            }
        }

        console.log(`THE STATE OF USER WIDGET :: ${JSON.stringify(this.state)}`);

        return (
            <div key={this.state.user.id}>
                <h2>{this.state.user.name}</h2>
                {userDetails}
                <hr/>
                <Link to="user" params={{id: this.state.user.id}}/>
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
