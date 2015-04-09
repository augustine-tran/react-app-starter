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

function getCurrentState(props, context, state) {
    let user = UserStore.get(id);

    return {
        isLoading: (user == null),
        user: user
    };
}

function fireActions(state, callback) {
    UserActions.getUser(params.id, callback);
}

/**
 * User Details shows full user details.
 *
 * It supports server side rendering.
 */
class Details extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            //this.state = props.data[];
        } else {
            this.state.user = props.user;
            this.state.isLoading = false;
        }
    }

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);

        fireActions(this.context.router.getCurrentParams());
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
    }

    /**
     * @return {object}
     */
    render() {
        let userDetails;

        if (this.state.isLoading === true) {
            userDetails = (
                <p><span>Loading more details...</span></p>
            );
        } else if (this.state.user.gender != null && this.state.isLoading === false) {
            userDetails = (
                <p><button onClick={_onButtonClick()}>Get user details!</button></p>
            );
        } else {
            userDetails = (
                <p><span>{ this.state.user.name } is { this.state.user.gender }!</span></p>
            );
        }

        return (
            <div>
                <h2>{ this.state.user.name }</h2>
                {userDetails}
                <RouteHandler data={this.props.data}/>
            </div>
        );
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onChange() {
        this.replaceState(getCurrentState(this.context.router.getCurrentParams().id));
    }

    _onButtonClick() {
        this.setState({isLoading: true}); // Set isLoading to true

        fireActions(this.context.router.getCurrentParams());
    }

    /**
     * Static method to trigger data actions for server-side rendering.
     *
     * @param params
     * @returns {*}
     */
    static fetchData(state, callback) {
        fireActions(state.params, callback);
    }
}

Details.contextTypes = {
    router: React.PropTypes.func.isRequired
};

Details.propTypes = {
    data: React.PropTypes.object
};

export default Details;
