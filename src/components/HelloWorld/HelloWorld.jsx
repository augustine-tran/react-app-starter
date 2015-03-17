var React = require('react');

var EmailStore = require('../../stores/EmailStore'),
  NameStore = require('../../stores/NameStore');

/**
 * Retrieve the current data from the EmailStore and NameStore
 */
function getCurrentState() {
  return {
    email: EmailStore.getEmail(),
    name: NameStore.getName()
  };
}

var Test = React.createClass({

  getInitialState: function() {
    return getCurrentState();
  },

  componentDidMount: function() {
    EmailStore.addChangeListener(this._onChange);
    NameStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    EmailStore.removeChangeListener(this._onChange);
    NameStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <p>Name: <input type="text" name="name" /></p>
        <p>Email: <input type="text" name="name" /></p>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getCurrentState());
  }

});

module.exports = Test;
