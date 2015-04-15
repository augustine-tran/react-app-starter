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
    UserActions.getUser(state.user.id, ['id', 'name', 'gender', 'birthday', ['address', 'line1'], ['address', 'line2']], callback);
}

/**
 * User Details shows a user full details.
 */
class Details extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        console.log(`PROPS :: ${JSON.stringify(props)}`);

        this.state = getInitialState();

        this.updateStateFromProps = (nextProps) => {
            // We should always treat state as immutable
            let newState = _.merge({}, this.state);

            newState.user.id = nextProps.id;

            this.setState(newState);
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            console.log("USING SERVER SIDE DATA IN USER DETAILS :: " + JSON.stringify(props.data));
            _.merge(this.state, props.data);

            this.state.isLoading = false;
        } else {
            let params = this.context.router.getCurrentParams();

            this.state.user = {
                id: params.id
            }
        }

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
    }

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);

        fireActions(this.state);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
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
                <Link to="user-details" params={{id: this.state.user.id + 1}}>Next user</Link>
                <button onClick={() => {this.context.router.goBack();}}>Back</button>
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
        console.log(`Router State : ${JSON.stringify(routerState)}`);
        let state = getInitialState();

        if (routerState.params != null) {
            if (routerState.params.id != null) {
                let userId = parseInt(routerState.params.id);

                if (!isNaN(userId)) {
                    state.user.id = userId;
                }
            }
        }

        console.log(`FIRING ACTIONS WITH STATE: ${JSON.stringify(state)}`);
        fireActions(state, callback);
    }
}

Details.contextTypes = {
    router: React.PropTypes.func.isRequired
};

Details.propTypes = {
    data: React.PropTypes.object
    //id: (props, propName, componentName) => {
    //    // Only required if data doesn't exist
    //    if (props['data'] == null) {
    //        return React.PropTypes.oneOfType([
    //            React.PropTypes.string,
    //            React.PropTypes.number
    //        ]).isRequired(props, propName, componentName);
    //    }
    //}
};

export default Details;
