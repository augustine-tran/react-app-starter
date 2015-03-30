'use strict';

import React from 'react';

var currentId = null;
var latestUrl = null;

function addScript(id) {
    if (!id) {
        throw new Error('Google analytics ID is undefined');
    }

    /*eslint-disable*/
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    /*eslint-enable*/

    window.ga('create', id, 'auto');
}

class GoogleAnalytics extends React.Component {
    getDefaultProps() {
        return {
            displayfeatures: false,
            pageview: false
        };
    }

    componentDidMount() {
        if (!GoogleAnalytics.isInitialized()) {
            GoogleAnalytics.init(this.props.id);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return null;
    }

    pageview() {
        var path = this.context.router.getPath();
        if (latestUrl === path) {
            return;
        }

        latestUrl = path;

        GoogleAnalytics.sendPageview(path);
    }

    static init(id) {
        if (!id) {
            throw new Error('Google analytics ID is undefined');
        }

        if (GoogleAnalytics.isInitialized()) {
            throw new Error('Google analytics is already initialized');
        }

        currentId = id;
        addScript(currentId);
    }

    static isInitialized() {
        return !!GoogleAnalytics.getId();
    }

    static getId() {
        return currentId;
    }

    static send(what, options) {
        if (!GoogleAnalytics.isInitialized()) {
            throw new Error('Google analytics is not initialized');
        }

        window.ga('send', what, options);
    }

    static sendPageview(relativeUrl, title) {
        title = title || relativeUrl;

        return GoogleAnalytics.send('pageview', {
            'page': relativeUrl,
            'title': title
        });
    }
}

GoogleAnalytics.propTypes = {
    id: React.PropTypes.string.isRequired,
    displayfeatures: React.PropTypes.bool,
    pageview: React.PropTypes.bool
};

GoogleAnalytics.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default GoogleAnalytics;
