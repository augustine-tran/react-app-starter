var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

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

var App = React.createClass({

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
        <h1>Hello World!</h1>
        <Link to="test">Test Link</Link>
        <RouteHandler/>
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

module.exports = App;
