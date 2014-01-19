var config = require('./config')
var irc    = require("irc");
var http   = require('http');

var bot = new irc.Client(config.server, config.botName, config.extra);

bot.addListener("message", function (from, to, text, message) {
    if ( message.command === 'PRIVMSG' && message.nick != 'dipsy' ) {
        var pattern = /\w*::\w*/;
        var match = pattern.exec(text);
        if (typeof match === 'undefined') {
        }
        else {
            is_module(match, message.args[0]);
        }
    }
});


function is_module(match, channel) {
    var options = {
        host: 'api.metacpan.org',
        method: "GET",
        path: '/module/' + match + '?fields=abstract,name'
    };

    callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            if (this.statusCode === 200) {
                var pod_url = 'https://metacpan.org/pod/' + match[0];
                var module = JSON.parse(str);
                var wisdom = pod_url;
                if ( module.hasOwnProperty('abstract') ) {
                    wisdom += ' ' + module.abstract;
                }
                bot.say(channel, wisdom);
            }
        });
    }

    http.request(options, callback).end();
}
