# ServerStatus
## 简介
ServerStatus [美化主题](https://www.hostloc.com/thread-494384-1-1.html).
> 仅使用此美化主题

![screenshot](https://raw.githubusercontent.com/stilleshan/ServerStatus/master/screenshot.jpg)


## 使用
### 访问地址
```
http://服务器IP:8888
```
> 使用域名和 HTTPS 协议可配置 Nginx 反向代理

### 配置
**config.json** 为服务器端配置文件,默认已经添加示例配置,可以根据示例格式修改,删除或者增加服务器.修改完毕后重启容器.
```shell
docker restart serverstatus
```


## 相关链接
- GitHub [stilleshan/ServerStatus](https://github.com/stilleshan/ServerStatus)
- Docker [stilleshan/serverstatus](https://hub.docker.com/r/stilleshan/serverstatus)
- 原版项目Github [ToyoDAdoubi/ServerStatus-Toyo](https://github.com/ToyoDAdoubi/ServerStatus-Toyo)
- Dockerfile参考 [cppla/ServerStatus](https://github.com/cppla/ServerStatus)