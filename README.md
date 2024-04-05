# 爱看短剧

## 介绍

基于thinkphp6.0 + uniapp开发的短剧搜索平台, 已兼容APP、H5、微信小程序

下载即可使用，内置搜索源。

~~~
小程序上，添加视频广告ID，可观看广告后获取链接。
~~~

~~~
H5上，模仿uniapp插件观看广告模式，扫码观看小程序广告可获取链接，给H5变现提供了一个思路。
~~~

## 后台管理

对于有搭建能力的开发者，提供了简单的独立后台。（一杯咖啡钱）

后台包含一套可用的夸克自动转存、自动分享、自动抓取功能。

设置好定时任务，基本可以做到全自动化管理。

## 线上地址

微信小程序

~~~
因备案，未上线。可下载后编译查看
~~~

[H5访问](https://ai-img.ycubbs.cn/duanju/)

## 沟通交流

使用中您有任何问题可以进群交流：331446855 <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=alwjBo-4oy8uA3dN6m9xuevF9hxPn2Mg&jump_from=webapi"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="技术交流" title="技术交流"></a>

## 免费接口

1、云端同步

~~~
https://ai-img.ycubbs.cn/api/duanju/list
~~~

2、短剧搜索

~~~
https://ai-img.ycubbs.cn/api/duanju/search?name=赘婿
~~~

3、每日更新

~~~
https://ai-img.ycubbs.cn/api/duanju/daily
~~~

## uniapp端修改

~~~
修改 common/environment.js 

BASE_API，自己搭建的域名

VIDEO_AD_ID，激励视频广告ID配置好即可小程序内观看广告显示分享链接
~~~

## 后台修改

1、按照宝塔配置好thinkphp6.0

2、初始化扩展

~~~
composer install
~~~

3、配置数据库

~~~
修改根目录下的 .env

DATABASE
USERNAME
PASSWORD

~~~

4、访问https://域名/admin显示后台登录

5、如需关闭/开启观看广告模式

~~~
可修改config/define.php

IS_AD
~~~

## 功能展示

![爱看短剧](https://files.ycubbs.cn/image/duanju/1.png)

![爱看短剧](https://files.ycubbs.cn/image/duanju/2.png)

![爱看短剧](https://files.ycubbs.cn/image/duanju/3.png)

![爱看短剧](https://files.ycubbs.cn/image/duanju/4.png)

### 后台演示（右键可查看原图）

![爱看短剧后台](https://files.ycubbs.cn/image/duanju/5.png)
![爱看短剧后台](https://files.ycubbs.cn/image/duanju/6.png)
![爱看短剧后台](https://files.ycubbs.cn/image/duanju/7.png)

## 打赏

如果这个项目让你受益，你可以打赏我1块钱，让我知道开源有价值。谢谢！

<img src="https://files.ycubbs.cn/image/public/wx-dashang.png" alt="微信打赏" style="width:200px;height: 200px" width="200" height="200"/>

<img src="https://files.ycubbs.cn/image/public/zfb-dashang.png" alt="微信打赏" style="width:200px;height: 200px" width="200" height="200"/>

## 声明

本程序为个人兴趣开发，开源仅供学习与交流使用。所有资源均来自互联网公开信息。

程序没有任何破解行为，只是对于夸克已有的API进行封装，所有数据来自于夸克官方API，本人不对网盘内容负责、不对夸克官方API未来可能的改动导致的后果负责。

任何单位或个人因下载使用此软件而产生的任何意外、疏忽、合约毁坏、诽谤、版权或知识产权侵犯及其造成的损失 (包括但不限于直接、间接、附带或衍生的损失等)，本人不承担任何法律责任。
