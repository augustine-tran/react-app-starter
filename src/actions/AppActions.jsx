var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * Hello World Action!
   * @param name
   */
  helloWorld: function (name, email) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.HELLO_WORLD,
      name: name,
      email: email
    });
  }
};

module.exports = AppActions;
