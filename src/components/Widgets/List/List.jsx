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
        let component = React.createFactory(this.props.of);

        invariant(
            (this.props.data.length >= this.props.children.length),
            `List data only has ${this.props.data.length} items but there are ${this.props.children.length} children.`
        );

        let nodes = this.props.data.map(function (data) {
            return component(data);
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
    of: React.PropTypes.instanceOf(React.Component).isRequired,
    data: React.PropTypes.object.isRequired
};

List.contextTypes = assign({}, ContextWrapper.contextTypes);

List.childContextTypes = assign({}, ContextWrapper.childContextTypes);

export default List;
