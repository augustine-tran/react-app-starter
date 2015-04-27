'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import assign from 'object-assign';
import {Link, RouteHandler} from 'react-router';

// Actions
import AppActions from '../../../actions/AppActions';
import UserActions from '../../../actions/UserActions';

// Stores
import UserStore from '../../../stores/UserStore';

function getInitialState() {
    return {
        isLoading: true,
        user: {}
    };
}

function getStateFromStores(parameters) {
    let user = UserStore.get(parameters.user.id);

    return (user == null) ? null : {
        isLoading: false,
        user: user
    };
}

function fireActions(state, callback) {
    let parameters = {
        id: state.user.id,
        fields: ['id', 'name', 'gender', 'birthday', ['address', 'line1'], ['address', 'line2']],
        callback: callback
    };

    UserActions.getUser(parameters);
}

/**
 * User Details shows a user full details.
 */
class Details extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = getInitialState();

        this.updateStateFromProps = (nextProps) => {
            // We should always treat state as immutable
            let newState = _.merge({}, this.state);

            if (nextProps.data != null) {
                // Server side rendering. Let's use the provided data first.
                _.merge(newState, nextProps.data);

                newState.isLoading = false;
            }

            this.setState(newState);
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(this.state, props.data);

            this.state.isLoading = false;
        }

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this.onChange = () => {
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
    }

    componentDidMount() {
        UserStore.listen(this.onChange);

        fireActions(this.state);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    /**
     * @return {object}
     */
    render() {
        let userDetails;

        if (this.state.isLoading === true) {
            userDetails = (
                <p><span>Loading user details...</span></p>
            );
        } else {
            userDetails = (
                <p>
                    <span>{this.state.user.name} is {this.state.user.gender} and born on {this.state.user.birthday}!</span>
                    <br />
                    <span>{this.state.user.address.line1}</span>
                    <br />
                    <span>{this.state.user.address.line2}</span>
                </p>

            );
        }

        return (
            <div>
                <h3>{this.state.user.name}</h3>
                {userDetails}
                <hr/>
                <button onClick={() => {this.context.router.transitionTo('user-details', {id: parseInt(this.state.user.id) + 1});}}>Next User</button>
                <br />
                <button onClick={() => { if (!this.context.router.goBack()) {this.context.router.transitionTo('app');}}}>Back</button>
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
        let state = getInitialState();

        if (routerState.params != null) {
            if (routerState.params.id != null) {
                let userId = parseInt(routerState.params.id);

                if (!isNaN(userId)) {
                    state.user.id = userId;
                }
            }
        }

        fireActions(state, callback);
    }
}

Details.contextTypes = {
    router: React.PropTypes.func.isRequired
};

Details.propTypes = {
    data: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        gender: React.PropTypes.string.isRequired,
        birthday: React.PropTypes.string.isRequired,
        address: React.PropTypes.shape({
            line1: React.PropTypes.string.isRequired,
            line2: React.PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Details;
