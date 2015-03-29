'use strict';

import {init} from './router';

if (typeof window !== 'undefined') {
    window.onload = function () {
        let data, hasServerData = false;
        let serverDataDOM = document.getElementById('server-data');

        if (serverDataDOM != null && serverDataDOM.innerHTML != null && serverDataDOM.innerHTML.length > 0) {
            try {
                data = JSON.parse(serverDataDOM.innerHTML);
                hasServerData = true;
            } catch (error) { console.log('Invalid server data.'); }

            serverDataDOM.remove();
        }

        init(hasServerData ? data : undefined);
    };
}
