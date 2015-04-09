'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {Link, RouteHandler} from 'react-router';

// Actions
import AppActions from '../../../actions/AppActions';
import UserActions from '../../../actions/UserActions';

// Stores
import UserStore from '../../../stores/UserStore';

function getCurrentState(previousState) {
    return {
        isLoadingMoreDetails: false,
        user: UserStore.get(previousState.user.id)
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

        console.log(`I'm a child, getting parent's Context! Does Context contain router? ${this.context.router != null}`);

        this.state = {
            isLoadingMoreDetails: false,
            user: props
        };
    }

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);

        fireActions(this.state);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
    }

    /**
     * @return {object}
     */
    render() {
        console.log(`I'm a child, getting parent's Context in my render()! Does Context contain router? ${this.context.router != null}`);

        let userDetails;

        if (this.state.isLoadingMoreDetails === true) {
            userDetails = (
                <p><span>Loading more details...</span></p>
            );
        } else if (this.state.isLoadingMoreDetails === false) {
            userDetails = (
                <p><button onClick={this._onButtonClick}>Get more user details!</button></p>
            );
        } else {
            userDetails = (
                <p><span>{this.state.user.name} is {this.state.user.gender}!</span></p>
            );
        }

        return (
            <div key={this.state.user.id}>
                <h2>{this.state.user.name}</h2>
                {userDetails}
                <hr/>
                <Link to="user" params={{id: this.state.user.id}}/>
            </div>
        );
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onChange() {
        this.replaceState(getCurrentState(this.state));
    }

    _onButtonClick() {
        //this.setState({isLoadingMoreDetails: true}); // Set isLoadingMoreDetails to true

        fireActions(this.state);
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
