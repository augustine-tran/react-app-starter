'use strict';

import React from 'react';

export default class Alert extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = {

        };
    }

    componentDidMount() {
        // TODO
    }

    componentWillUnmount() {
        // TODO
    }

    /**
     * @return {object}
     */
    render() {
        var completed = +this.props.completed;
        if (completed < 0) {completed = 0};
        if (completed > 100) {completed = 100};

        var style = {
            backgroundColor: this.props.color || '#0BD318',
            width: completed + '%',
            transition: "width 200ms",
            height: 10
        };

        return (
            <div id="toast-container" class="toast-top-right" role="alert">
                <div class="toast toast-success" style="display: block;">
                    <button type="button" class="toast-close-button" role="button">×</button>
                    <div class="toast-message">Inconceivable!</div>
                </div>
                <div class="toast toast-success" style="display: block;">
                    <button type="button" class="toast-close-button" role="button">×</button>
                    <div class="toast-message">Inconceivable!</div>
                </div>
                <div class="toast toast-success" style="display: block;">
                    <div class="toast-progress" style={style}></div>
                    <button type="button" class="toast-close-button" role="button">×</button>
                    <div class="toast-title">asd</div>
                    <div class="toast-message">asdas</div>
                </div>
            </div>
        );
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onChange() {
        // TODO
        //this.replaceState();
    }
}

Alert.propTypes = {
    type: React.PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
};

Alert.defaultProps = {
    type: 'info'
};
