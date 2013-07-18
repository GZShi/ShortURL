var settings = require('./config').settings;
var url = require('url');
var querystring = require('querystring');
var settings = require('./config').settings;
var trie = require('./trie');

var HOST = settings.HOST;

var charArray = ['xZtVcpin1JWYQRKsmrdz7UPIy4aOELT5bFBSjHDMwkevqou82gX3lCN9h60fAG',
				 'yYfPBjgWOE9CFqkA4VGupHNisRS0658JnmMb2dZlcTxorwL7haz31KQIvUDtXe',
				 'hl5Eifc7CeBtysk9K8YuoZR6Qxb1IWVXFvPrJwLgdNqTzAUMpDj2n0mH34aOSG',
				 'q8Jw9Q7BAvSdbfEti0e2KRXxDlhz46YLWc5UFkrPpmGgyInjCTuoOVHs3aMN1Z',
				 'zC8TuLtkZohN092DIOUsBavmbWfjcJrgH1QMdwVG67nSqxPylRi435AXFYKEpe',
				 'L3NKSylIEfsFqcDwuebm5ovpkZ6gQ1xWXa8dCOGAUTMBjPR270hJn4tzYVri9H'];

var recordId = 62*62 + 62 + 1;

var aliasRoot = trie.newTree();
var originRoot = trie.newTree();

// 用于随机生成charArray
// function shuffle(str) {
// 	var len = str.length;
// 	var str2arr = str.split('');
// 	var output = '';
// 	var r = 0;

// 	for(	; len > 0; --len) {
// 		r = Math.floor(Math.random() * len);
// 		output += str2arr[r];
// 		str2arr.splice(r, 1);
// 	}

// 	return output;
// }

function encode(number) {
	var alias = '';

	for(var i = 0; number > 0; ++i) {
		alias = charArray[i].charAt(number % 61) + alias;
		number = parseInt(number / 61);
	}

	return alias;
}

// 生成随机别名
function getShortURL(origin, res) {
	//console.log(url.parse(origin).host);
	origin = decodeURI(origin);
	if(url.parse(HOST).host.toLowerCase() == url.parse(origin).host.toLowerCase()) {
		res.send('不能加密该网址');
		return false;
	}

	var alias = originRoot.find(origin);
	if(!alias) {
		while(true) {
			alias = '/' + encode(recordId);
			if(aliasRoot.find(alias)) {
				recordId++;
			} else {
				break;
			}
		}
	}
	res.send(HOST + alias);
	aliasRoot.add(alias, origin);
	originRoot.add(origin, alias)
}

// 存储自定义记录
function saveRecord(origin, alias, res) {
	var tpl = /^[0-9a-zA-Z_]*$/;		// 只支持大小写英文数字下划线
	origin = decodeURI(origin);		// 待改进
	alias = decodeURI(alias);		// 待改进

	if(tpl.test(alias) == false) {
		res.send('别名格式不正确');
		return ;
	} else if(url.parse(HOST).host.toLowerCase() == url.parse(origin).host.toLowerCase()){
		res.send('不能加密该网址');
		return ;
	}

	alias = '/' + alias;

	if(aliasRoot.find(alias)) {
		res.send('别名已经存在');
	} else if(originRoot.find(origin)) {
		res.send('网址已经存在，对应的别名是：' + originRoot.find(origin));
	} else {
		aliasRoot.add(alias, origin);
		res.send('自定义别名保存成功！');
		originRoot.add(origin, alias);
	}
}

function getOrigin(alias) {
	return aliasRoot.find(alias);
}

exports.getShortURL = getShortURL;
exports.saveRecord = saveRecord;
exports.getOrigin = getOrigin;