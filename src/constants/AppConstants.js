var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    SOME_ACTION: null,
    EXAMPLE_ACTION: null,
    HELLO_WORLD: null
  }),

  EventTypes: keyMirror({
    EMAIL_CHANGE: null,
    NAME_CHANGE: null
  })

};
