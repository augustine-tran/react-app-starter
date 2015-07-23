'use strict';

export default {
    throwError: function (status, message) {
        if (status == null) {
            status = 500;
        }

        if (message == null) {
            message = 'Server Error';
        }

        var error = new Error(message);
        error.status = status;

        return error;
    },

    throwWtfError: function(message) {
        if (message == null) {
            message = 'WTF, What a Terrible Failure!';
        }

        return this.throwError(500, message);
    },

    throwBadRequestError: function(message) {
        if (message == null) {
            message = 'Bad Request';
        }

        return this.throwError(400, message);
    },

    throwConflictError: function(message) {
        if (message == null) {
            message = 'Conflict';
        }

        return this.throwError(409, message);
    },

    throwUnauthorizedError: function(message) {
        if (message == null) {
            message = 'Unauthorized';
        }

        return this.throwError(401, message);
    },

    throwForbiddenError: function(message) {
        if (message == null) {
            message = 'Forbidden';
        }

        return this.throwError(403, message);
    }
};
