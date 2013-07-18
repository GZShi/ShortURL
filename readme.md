# 短网址服务

简单的短网址服务，支持自定义别名和随机别名。

## 安装

```
npm install
```

## 用法

**启用服务** 

```
node index
```

**get模式获取随机别名** 以获取`http://google.com/`的别名为例

```
http://localhost:8088/url?url=http://google.com/
```

**get方式存储自定义别名** 

```
http://localhost:8088/define?origin=http://google.com/&alias=google
```

## LICENSE

MIT

## 日期
201307182248