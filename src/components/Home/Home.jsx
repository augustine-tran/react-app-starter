'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
//import {RouteHandler} from 'react-router';

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

function fireActions(state, callback) {
    let parameters = {
        page: state.page,
        perPageCount: state.perPageCount,
        callback: callback
    };

    UserActions.getUsers(parameters);
}

class Home extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = getInitialState();

        if (context.router.params != null) {
            if (context.router.params.page != null) {
                let page = parseInt(context.router.params.page);

                if (!isNaN(page)) {
                    this.state.page = page;
                }
            }

            if (context.router.params.per_page_count != null) {
                let perPageCount = parseInt(context.router.params.per_page_count);

                if (!isNaN(perPageCount)) {
                    this.state.perPageCount = perPageCount;
                }
            }
        }

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this.onChange = () => {
            console.log(`HOME ONCHANGE TRIGGERED`);

            let parameters = {
                page: this.state.page,
                perPageCount: this.state.perPageCount
            };

            let newState = getStateFromStores(parameters);

            console.log(`HOME ONCHANGE NEW STATE :: ${JSON.stringify(newState)}`);

            if (newState != null) {
                this.setState(newState);
            }
        };

        this.onNextButtonClicked = () => {
            let page = this.state.page + 1;

            this.loadPage(page);
        };

        this.onPrevButtonClicked = () => {
            let page = this.state.page - 1;

            if (page < 1) {
                page = 1;
            }

            this.loadPage(page);
        };

        this.loadPage = (page) => {
            // TODO : Use router to transition to next / prev page
            this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true, page: page, perPageCount: this.state.perPageCount}), () => {
                fireActions(this.state);
            }); // Set isLoadingMoreDetails to true
        };
    }

    componentDidMount() {
        UserStore.listen(this.onChange);
    }

    componentWillMount() {
        this.onChange();
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    }

    /**
     * @return {object}
     */
    render() {
        return (
            <div>
                <h2>USER DETAILS - Page {this.state.page}</h2>
                <hr />
                <List of={React.createFactory(UserWidget)} dataSet={this.state.users} />
                <p><button onClick={this.onPrevButtonClicked}>&#8592; Prev</button> or <button onClick={this.onNextButtonClicked}>Next &#8594;</button></p>
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

Home.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Home;
