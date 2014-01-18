var config = require('./config')
var irc    = require("irc");
var http   = require('http');

var bot = new irc.Client(config.server, config.botName, config.extra);

bot.addListener("message", function (from, to, text, message) {
    var pattern = /\w*::\w*/;
    var match = pattern.exec(text);
    var response_code = is_module(match);
});


function is_module(match) {
    var options = {
        host: 'api.metacpan.org',
        path: '/module/' + match + '?fields=name'
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
                bot.say(config.extra.channels[0], pod_url);
            }
        });
    }

    http.request(options, callback).end();
}
