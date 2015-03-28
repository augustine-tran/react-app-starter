'use strict';

var Routes = require('./routes');

if (window != null) {
    window.onload = function () {
        var data, hasServerData = false;
        var serverDataDOM = document.getElementById('server-data');

        if (serverDataDOM != null && serverDataDOM.innerHTML != null && serverDataDOM.innerHTML.length > 0) {
            try {
                data = JSON.parse(serverDataDOM.innerHTML);
                hasServerData = true;
            } catch (error) { console.log('Invalid server data.'); }

            serverDataDOM.remove();
        }

        Routes.init(hasServerData ? data : undefined);
    };
}
