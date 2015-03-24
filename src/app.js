var React = require('react');

var Routes = require('./routes');

if (window != null) {
    window.onload = Routes.init;
}
