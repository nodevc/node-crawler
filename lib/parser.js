var jsdom = require('jsdom'),
    cheerio = require('cheerio'),
    path = require("path"),
    fs = require("fs");

exports.inject = function(response, callback) {
    var $ = undefined;
    var options = response.options;

    if (options.parser.name === "cheerio") {
        $ = cheerio.load(response.body);
        callback(null, $);
    }
    if (options.parser.name === "jsdom") {
        var scriptLocation = options.parser.url ? options.parser.url : path.resolve(__dirname,"../vendor/jquery-1.8.3.min.js");
        readJqueryUrl(scriptLocation, function(err, jquery) {
            var env = jsdom.env({
                url : options.uri,
                html : response.body,
                src: [jquery],
                done : function(errors, window) {
                    $ = window.jQuery;
                    callback(errors, $)
                }
            });
        });
    }
};
function readJqueryUrl (url, callback) {
    if (url.match(/^(file\:\/\/|\/)/)) {
        fs.readFile(url.replace(/^file\:\/\//,""),"utf-8",function(err,jq) {
            callback(err, jq);
        });
    } else {
            callback(null, url);
    }
}
