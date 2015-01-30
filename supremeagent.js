define(function(require, exports, module) {
    var _          = require('underscore');
    var superagent = require('superagent');
    var Request    = superagent.Request;

    function MyRequest() {
        Request.apply(this, arguments);
    }

    MyRequest.prototype = Object.create(Request.prototype);
    MyRequest.prototype.constructor = MyRequest;

    MyRequest.prototype.original_end = Request.prototype.end;

    MyRequest.prototype.end = function(fn) {
        this.endCallback = fn;
        this.original_end(fn);
    };

    MyRequest.prototype.inspect = function(fn) {
        this.inspectFunction = fn;
        return this;
    };

    MyRequest.prototype.repeat = function() {
        this.end(this.endCallback);
    };

    var supremeagent = function request(method, url) {
        if ('function' == typeof url) {
           return new MyRequest('GET', method).end(url);
        }

        if (1 == arguments.length) {
            return new MyRequest('GET', method);
        }

        return new MyRequest(method, url);
    }

    _.extend(supremeagent, superagent);
    supremeagent.get =  function(url, data, fn) {
        var req = this('GET',url);
        if ('function' == typeof data) fn = data, data = null;
        if (data) req.query(data);
        if (fn) req.end(fn);
        return req;
    };

    supremeagent.post =  function(url, data, fn) {
        var req = this('POST', url);
        if ('function' == typeof data) fn = data, data = null;
        if (data) req.send(data);
        if (fn) req.end(fn);
        return req;
    };

    supremeagent.Request = MyRequest;

    module.exports = supremeagent;
});
