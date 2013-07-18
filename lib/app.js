// app config
var express = require('express');
var url = require('url');
var querystring = require('querystring');

var trie = require('./trie');
var basex = require('./basex');
var settings = require('./config').settings;

// basic config
var HOST = settings.HOST;
var defaultJumpURL = settings.NOTFOUND;
var jumpType = settings.TYPE;

var app = express();
app.use(express.bodyParser());

// 错误网页跳转到/error页面
app.get('/error', function(req, res) {
	res.send('Bad require!');
});

// 获取略缩网址的get方法和post方法
app.get('/url', function(req, res) {
	var origin = querystring.parse(url.parse(req.url).query)['url'];
	basex.getShortURL(origin, res);

});
app.post('/url', function(req, res) {
	var origin = req.body.url;	// 接受一个json格式
	basex.getShortURL(origin, res);
});

// 自定义略缩网址的get方法和post方法
app.get('/define', function(req, res) {
	var query = url.parse(req.url).query;
	var origin = querystring.parse(query)['origin'];
	var alias = querystring.parse(query)['alias'];

	basex.saveRecord(origin, alias, res);
});

app.post('/define', function(req, res) {
	var origin = req.body.origin;
	var alias = req.body.alias;

	basex.saveRecord(origin, alias, res);
})

// 跳转函数
app.get('/*', function(req, res) {
	var alias = url.parse(req.url).pathname;
	var query = querystring.parse(url.parse(req.url).query);
	var jumpTarget = defaultJumpURL;

	alias = decodeURI(alias);

	// 寻找是否有匹配的跳转
	var origin = basex.getOrigin(alias);
	if(origin)
		jumpTarget = origin;

	if(jumpType == '301') {
		res.redirect(301, jumpTarget);
	} else {
		res.writeHead(200, {'content-type': 'text/html; charset="utf-8"'});
		res.end('<html><meta http-equiv="refresh" content="0;url=' + jumpTarget + '"></html>');
	}
});


app.listen(8088);

console.log('service start');