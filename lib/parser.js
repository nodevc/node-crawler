var jsdom = require('jsdom'),
    cheerio = require('cheerio');

exports.inject = function(response, callback) {
    var $ = undefined;
    var options = response.options;

    if (options.parser.name === "cheerio") {
        $ = cheerio.load(response.body);
        callback(null, $);
    }
    if (options.parser.name === "jsdom") {
        var env = jsdom.env({
            "url" : options.uri,
            "html" : response.body,
            scripts: ["http://code.jquery.com/jquery.js"],
            "done" : function(errors, window) {
                $ = window.jQuery;
                callback(errors, $)
            }
        });
    }
    return $;
};

function jsenv (script) {
    var env = jsdom.env({
        "url":response.options.uri,
        "html":response.body,
        "script":script,
        "done":function(errors,window) {

            var callbackError = false;

            try {
                response.window = window;
                response.options.callback(errors,response,window.jQuery);
            } catch (e) {
                callbackError = e;
            }

            // Free jsdom memory
            if (response.options.autoWindowClose) {
                try {
                    window.close();
                    window = null;
                } catch (err) {
                    console.log("Couldn't window.close : "+err);
                }
                response.body = null;
                response = null;
            }

            release(response.options);

            if (callbackError) throw callbackError;
        }
    });
}

function readJqueryUrl (url) {
    if (url.match(/^(file\:\/\/|\/)/)) {
        fs.readFile(url.replace(/^file\:\/\//,""),"utf-8",function(err,jq) {
            return jq;
        });
    } else {
            return jq;
    }
}
