#系统功能测试, 测试可以完成需求中规定的功能

可以采用mocha-casperjs来虚拟一个浏览器访问服务器，进而模拟各种操作。

website 目录执行
sudo npm install -g mocha
sudo npm install -g mocha-casperjs
npm install

验证成功，输入下面三个命令不报错。
phantom
mocha
mocha-casperjs 

1.先启动服务器
2.在本目录下执行mocha-casperjs来运行已经写好的例子


#或者使用junit，httpunit提供的网页访问工具