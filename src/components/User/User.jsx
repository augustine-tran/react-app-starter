'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {Link, RouteHandler} from 'react-router';

// Actions
import AppActions from '../../actions/AppActions';
import UserActions from '../../actions/UserActions';

// Stores
import UserStore from '../../stores/UserStore';

function getCurrentState(id) {
    return {
        user: UserStore.get(id)
    };
}

function fireActions(params, callback) {
    UserActions.getUser(params.id, callback);
}

class User extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = {
            user: {
                name: '...'
            }
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(this.state, props.data);
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
        return (
            <div>
                <p><span>Request for user "{ this.state.user.name }"!</span></p>
                <button className="primary" onClick={() => { AppActions.showAlert('info', 'oh my...', 'hello'); }}>Show Alert</button>
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

User.contextTypes = {
    router: React.PropTypes.func.isRequired
};

User.propTypes = {
    data: React.PropTypes.object
};

export default User;
