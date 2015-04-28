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
    let parameters = {
        id: state.user.id,
        fields: ['id', 'name', 'gender', ['address', 'line1'], ['address', 'line2']],
        callback: callback
    };

    UserActions.getUser(parameters);
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
            user: props // We set props as user
        };

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this.onChange = () => {
            console.log(`WIDGET ONCHANGE TRIGGERED`);

            let parameters = {
                user: {
                    id: this.state.user.id
                }
            };

            let newState = getStateFromStores(parameters);

            console.log(`WIDGET ONCHANGE NEW STATE :: ${JSON.stringify(newState)}`);

            if (newState != null) {
                this.setState(newState);
            }
        };

        /**
         * Event handler for 'button click' events coming from the button
         */
        this.onButtonClick = () => {
            console.log(`ON BUTTON CLICK!`);

            this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true, isFirstLoad: false}), () => {
                fireActions(this.state);
            }); // Set isLoadingMoreDetails to true
        };
    }

    componentDidMount() {
        UserStore.listen(this.onChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
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
                    <p>
                        <span>{this.state.user.name} is {this.state.user.gender}!</span>
                        <br />
                        <span>{this.state.user.address.line1}</span>
                        <br />
                        <span>{this.state.user.address.line2}</span>
                    </p>

                );
            } else {
                userDetails = (
                    <p><button onClick={this.onButtonClick}>Get more user details!</button></p>
                );
            }
        }

        return (
            <div key={this.state.user.id}>
                <h3>{this.state.user.name}  - (ID : {this.state.user.id})</h3>
                {userDetails}
                <br />
                <Link to="user-details" params={{id: this.state.user.id}}>Full Details</Link>
                <hr />
            </div>
        );
    }
}

Widget.contextTypes = {
    router: React.PropTypes.func.isRequired
};

Widget.propTypes = {
    id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]).isRequired,
    name: React.PropTypes.string.isRequired
};

export default Widget;
