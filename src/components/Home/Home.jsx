'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {RouteHandler} from 'react-router';

// Components
import {Button} from 'react-bootstrap';
import List from '../Widgets/List';
import UserWidget from '../User/Widget';

// Actions
import UserActions from '../../actions/UserActions';

// Stores
import UserStore from '../../stores/UserStore';

function getInitialState() {
    return {
        users: [],
        page: 1,
        perPageCount: 5
    };
}

function getStateFromStores(parameters) {
    let users = UserStore.getPage(parameters.page, parameters.perPageCount);

    return (users == null) ? null : {
        page: parameters.page,
        perPageCount: parameters.perPageCount,
        users: users
    };
}

function fireActions(parameters, callback) {
    UserActions.getUsers(parameters.page, parameters.perPageCount, callback);
}

class Home extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = getInitialState();

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this._onChange = () => {
            let parameters = {
                page: this.state.page,
                perPageCount: this.state.perPageCount
            };

            let newState = getStateFromStores(parameters);

            if (newState != null) {
                this.setState(newState);
            }
        };

        this._onNextButtonClicked = () => {
            let page = this.state.page + 1;

            this._onLoadPage(page);
        };

        this._onPrevButtonClicked = () => {
            let page = this.state.page - 1;

            if (page < 1) {
                page = 1;
            }

            this._onLoadPage(page);
        };

        this._onLoadPage = (page) => {
            this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true, page: page, perPageCount: this.state.perPageCount}), () => {
                fireActions({
                    page: this.state.page,
                    perPageCount: this.state.perPageCount
                });
            }); // Set isLoadingMoreDetails to true
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(this.state, props.data);
        }
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
        return (
            <div>
                <h2>USER DETAILS - Page {this.state.page}</h2>
                <hr />
                <List of={React.createFactory(UserWidget)} dataSet={this.state.users}  />
                <p><button onClick={this._onPrevButtonClicked}>&#8592; Prev</button> or <button onClick={this._onNextButtonClicked}>Next &#8594;</button></p>
                <RouteHandler data={this.props.data} />
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
        // TODO: Get state from router params
        let state = getInitialState();

        if (routerState.params != null) {
            if (routerState.params.page != null) {
                let page = parseInt(routerState.params.page);

                if (!isNaN(page)) {
                    state.page = page;
                }
            }

            if (routerState.params.per_page_count != null) {
                let perPageCount = parseInt(routerState.params.per_page_count);

                if (!isNaN(perPageCount)) {
                    state.perPageCount = perPageCount;
                }
            }
        }

        fireActions(state, callback);
    }
}

export default Home;
