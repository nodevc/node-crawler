var request = require('request');
var crawlerResponse = require('./crawlerResponse');
var _ = require('lodash');

function crawlerRequest (options) {

    if (options.debug) {
        console.log(options.method+" "+options.uri+" ...");
    }

    // Cloning keeps the options parameter clean:
    // - some versions of "request" apply the second parameter as a
    // property called "callback" to the first parameter
    // - keeps the query object fresh in case of a retry
    // Doing parse/stringify instead of _.clone will do a deep clone and remove functions

    var ropts = JSON.parse(JSON.stringify(options));

    if (!ropts.headers) ropts.headers={};
    if (ropts.forceUTF8) {
        if (!ropts.headers["Accept-Charset"] && !ropts.headers["accept-charset"]) ropts.headers["Accept-Charset"] = 'utf-8;q=0.7,*;q=0.3';
        if (!ropts.encoding) ropts.encoding=null;
    }
    if (typeof ropts.encoding === 'undefined') {
        ropts.headers["Accept-Encoding"] = "gzip";
        ropts.encoding = null;
    }
    if (ropts.userAgent) {
        ropts.headers["User-Agent"] = ropts.userAgent;
    }
    if (ropts.referer) {
        ropts.headers["Referer"] = ropts.referer;
    }
    if (ropts.proxies && ropts.proxies.length) {
        ropts.proxy = ropts.proxies[0];
    }

    var requestArgs = ["uri","url","qs","method","headers","body","form","json","multipart","followRedirect","followAllRedirects",
        "maxRedirects","encoding","pool","timeout","proxy","auth","oauth","strictSSL","jar","aws"];


    var req = request(_.pick.apply(this,[ropts].concat(requestArgs)), function(error,response,body) {
        if (error) {
            self.onContent(error, options);
        }
        response.uri = response.request.href;

        // Won't be needed after https://github.com/mikeal/request/pull/303 is merged
        if (response.headers['content-encoding'] && response.headers['content-encoding'].toLowerCase().indexOf('gzip') >= 0) {
            zlib.gunzip(response.body, function (error, body) {
                if (error) return self.onContent(error, options);

                if (!options.forceUTF8) {
                    response.body = body.toString(req.encoding);
                } else {
                    response.body = body;
                }

                self.onContent(error,options,response,false);
            });
        } else {
            self.onContent(error,options,response,false);
        }
    });
}

module.exports = crawlerRequest;