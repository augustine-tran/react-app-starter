var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var _data = {
  name: 'Tom Hanks'// Default Email
};

function updateName(name) {
  if (name != null) {
    name = name.trim();

    if (name.length >= 1 && name !== _data.name) {
      _data.name = name.trim();

      NameStore.emitChange();
    }
  }
}

var NameStore = assign({}, EventEmitter.prototype, {
  getName: function () {
    return _data.name;
  },

  emitChange: function() {
    this.emit(AppConstants.EventTypes.NAME_CHANGE);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(AppConstants.EventTypes.NAME_CHANGE, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.EventTypes.NAME_CHANGE, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var name;

  switch(action.actionType) {
    case AppConstants.ActionTypes.HELLO_WORLD:
      name = action.name.trim();

      if (name !== '') {
        updateName(name);
      }
      break;

    default:
      // no op
  }
});

module.exports = NameStore;
