var Crawler = require("../../lib/crawler").Crawler;

QUnit.module("parser");

var DEBUG = false;
var MOCKPORT = 30045;

test("no parser", function() {
    expect(1);
    stop();
    var c = new Crawler({
        debug : DEBUG,
        parser : false
    });
    c.queue([{
        uri : "http://127.0.0.1:"+MOCKPORT+"/mockfiles/links1.html",
        callback : function(error,result,$) {
            equal($, null);
            start();
        }
    }]);
});

test("cheerio parser", function() {
    expect(3);
    stop();
    var c = new Crawler({
        debug : DEBUG,
        parser : { name : "cheerio" }
    });
    c.queue([{
        uri : "http://127.0.0.1:"+MOCKPORT+"/mockfiles/links1.html",
        callback : function(error,result,$) {
            var $a = $('a');
            equal('a', $a[0].name);
            equal(2, $a.length);
            equal('links2.html', $a[0].attribs.href);
            start();
        }
    }]);
});

test("jsdom parser", function() {
    expect(2);
    stop();
    var c = new Crawler({
        debug : DEBUG,
        parser : { name : "jsdom" }
    });
    c.queue([{
        uri : "http://127.0.0.1:"+MOCKPORT+"/mockfiles/links1.html",
        callback : function(error,result,$) {
            equal(2, $("a").length);
            equal("links2.html", $("a").first().attr("href"));
            start();
        }
    }]);
});