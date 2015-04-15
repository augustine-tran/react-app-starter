'use strict';

// React
import React from 'react/addons';
import invariant from 'react/lib/invariant';

// Libraries
import assign from 'object-assign';

// Components
import ContextWrapper from '../ContextWrapper';

class List extends ContextWrapper {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = {
            dataSet: []
        };

        this.updateProps = (nextProps) => {
            this.state.dataSet = nextProps.dataSet;
            this.state.of = nextProps.of;
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(this.state, props.data);
        } else {
            this.updateProps(props);
        }
    }

    /**
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.updateProps(nextProps);
    }

    render() {
        let body;
        let factory = this.state.of;

        if (this.state.dataSet != null && this.state.dataSet.length > 0) {
            body = this.state.dataSet.map((data, index) => {
                data.key = data.id; // Set the unique key

                return factory(data);
            });
        } else {
            body = (
                <span>No items loaded...</span>
            );
        }

        return (
            <div>
                {body}
            </div>
        );
    }
}

List.propTypes = {
    //of: (props, propName, componentName) => {
    //    let propValue = props[propName];
    //
    //    // TODO Well this looks super hacky...
    //    // Refer to React.addons.TestUtils.isCompositeComponentElement
    //    if (typeof propValue !== 'function'
    //        || propValue.type == null || typeof propValue.type !== 'function'
    //        || propValue.type.prototype == null || typeof propValue.type.prototype !== 'object'
    //        ||  typeof propValue.prototype.render !== 'function' || typeof propValue.prototype.setState !== 'function') {
    //        return new Error(`Invalid prop \`${propName}\` of type \`${typeof of}\` supplied to \`${componentName}\`, expected \`Composite Component\`.`);
    //    }
    //},
    of: React.PropTypes.func.isRequired,
    dataSet: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    })).isRequired
};

List.contextTypes = assign({}, ContextWrapper.contextTypes);

List.childContextTypes = assign({}, ContextWrapper.childContextTypes);

export default List;
