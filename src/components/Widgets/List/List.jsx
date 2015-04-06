'use strict';

// React
import React from 'react/addons';
import invariant from 'react/lib/invariant';

// Libraries
import assign from 'object-assign';

// Components
import ContextWrapper from '../ContextWrapper';

class List extends ContextWrapper {

    processChildren() {
        let nodes = this.props.data.map(function (data) {
            return this.props.of(data);
        });

        return nodes;
    }

    render() {
        let listItemNodes = this.processChildren();

        return (
            <div >
                { listItemNodes }
            </div>
        );
    }
}

List.propTypes = {
    of: React.PropTypes.element.isRequired,
    data: React.PropTypes.array.isRequired
};

List.contextTypes = assign({}, ContextWrapper.contextTypes);

List.childContextTypes = assign({}, ContextWrapper.childContextTypes);

export default List;
