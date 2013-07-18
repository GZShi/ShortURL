var trie = (function() {
	function trie(c, url) {
		this.value = c ? c : '';
		this.url = url;
		this.children = [];
	}

	/*
	 * 判断自身是否为空
	 * 递归判断子树是否为空
	 */
	trie.prototype.isEmpty = function() {
		if(this.children.length == 0 && this.value != '') {
			return true;
		} else {
			for(var i = 0, len = this.children.length; i < len; ++i) {
				if(!this.children[i].isEmpty()) {
					return false;
				}
			}
			return true;
		}
	}

	/*
	 * 匹配字符串
	 * 如果字符串存在，则返回其对应的数据
	 * 不存在，则返回false
	 */
	trie.prototype.find = function(str) {
		if(str.length == 0) {
			for(var i = 0, len = this.children.length; i < len; ++i) {
				if(this.children[i].value == '') {
					// return true;
					return this.children[i].url;
				}
			}
			return false;
		} else {
			for(var i = 0, len = this.children.length; i < len; ++i) {
				if(this.children[i].value == str.charAt(0)) {
					return this.children[i].find(str.substr(1));
				}
			}
			return false;
		}
	};

	/*
	 * 添加一个短网址记录
	 * 在一条记录结束的地方存入对应url
	 *
	 */
	trie.prototype.add = function(str, url) {
		if(str.length <= 0) {
			for(var i = 0, len = this.children.length; i < len; ++i) {
				if(this.children[i].value == '') {
					return ;
				}
			}
			this.children.unshift(new trie('', url));		// 处在数组最前端
			return ;
		}
		for(var i = 0, len = this.children.length; i < len; ++i) {
			if(this.children[i].value == str.charAt(0)) {
				this.children[i].add(str.substr(1), url);
				return ;
			}
		}
		var newChild = new trie(str.charAt(0));
		newChild.add(str.substr(1), url);
		this.children.push(newChild);
	};

	/*
	 * 删除一条记录
	 *
	 */
	trie.prototype.remove = function(str) {
		if(str.length == 0) {
			if(this.children.length > 0 && this.children[0].value == '') {
				this.children.shift();
				return true;
			} else {
				return false;
			}
		} else {
			for(var i = 0, len = this.children.length; i < len; ++i) {
				if(this.children[i].value == str.charAt(0)) {
					if(this.children[i].remove(str.substr(1))) {
						if(this.children[i].children.length == 0) {
							this.children.splice(i, 1);
						}
						return true;
					}
					return false;
				}
			}
			return false;
		}
	};

	trie.prototype.toString = function() {
		return JSON.stringify(this);
	}

	return trie;
})();

function newTree() {
	return new trie('');
}

exports.newTree = newTree;
