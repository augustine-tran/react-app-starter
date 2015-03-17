var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var _data = {
  email: 'tom.hanks@fedex.com'// Default Email
};

function updateEmail(email) {
  if (email != null) {
    email = email.trim();

    if (email.length >= 1 && email !== _data.email) {
      _data.email = email.trim();

      EmailStore.emitChange();
    }
  }
}

var EmailStore = assign({}, EventEmitter.prototype, {
  getEmail: function () {
    return _data.email;
  },

  emitChange: function() {
    this.emit(AppConstants.EventTypes.EMAIL_CHANGE);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(AppConstants.EventTypes.EMAIL_CHANGE, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.EventTypes.EMAIL_CHANGE, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var email;

  switch(action.actionType) {
    case AppConstants.ActionTypes.HELLO_WORLD:
      email = action.email.trim();

      if (email !== '') {
        updateEmail(email);
      }
      break;

    default:
      // no op
  }
});

module.exports = EmailStore;
