# GNSS 稳定性测试网页：稳定部署方案

这个网页是纯静态页面，只需要发布同一目录下的两个文件：

- `index.html`
- `mqtt.min.js`

页面会在浏览器里直接连接 MQTT WebSocket：

- Broker: `wss://broker.emqx.io:8084/mqtt`
- Topic: `device/gnss/#`

## 推荐方案：HTTPS 静态托管

不要再用本机公网隧道作为长期入口。更稳定的做法是把这两个静态文件部署到有 HTTPS 的静态网站平台，例如：

- Cloudflare Pages
- GitHub Pages
- Netlify
- Vercel
- 自己的云服务器 + Nginx + HTTPS 证书

部署后会得到一个固定的 `https://...` 地址。把这个地址发给手机或其他网络下的人，对方就可以打开网页并运行测试。

## 为什么必须 HTTPS

手机定位 `navigator.geolocation` 属于浏览器敏感权限。除了 `localhost` 以外，手机浏览器通常只允许 HTTPS 页面调用定位。

所以：

- `http://电脑局域网IP:端口` 可以打开页面，但手机定位大概率会被浏览器拦截。
- `https://稳定域名` 才适合正式发给别人测试。

## Cloudflare Pages 快速发布

1. 登录 Cloudflare，进入 Workers & Pages。
2. 新建 Pages 项目。
3. 选择 Direct Upload。
4. 上传本目录里的 `index.html` 和 `mqtt.min.js`。
5. 等待部署完成，复制 Cloudflare 给出的 `https://xxx.pages.dev` 地址。
6. 用手机打开该 HTTPS 地址，允许定位权限。

## GitHub Pages 快速发布

1. 新建一个 GitHub 仓库，例如 `gnss-stability-test`。
2. 上传 `index.html` 和 `mqtt.min.js` 到仓库根目录。
3. 进入仓库 Settings -> Pages。
4. Source 选择 Deploy from a branch，Branch 选择 `main` 和 `/root`。
5. 保存后等待几分钟，访问 GitHub Pages 给出的 HTTPS 地址。

## 更稳定的 MQTT 建议

当前页面使用的是公共 EMQX Broker：`broker.emqx.io`。它方便测试，但不适合作为长期生产依赖。

如果测试数据很重要，建议后续换成自己的 MQTT Broker，例如：

- EMQX Cloud
- HiveMQ Cloud
- 自建 EMQX / Mosquitto，并开启 WebSocket over TLS

换 Broker 时，只需要修改 `index.html` 里的：

```js
const MQTT_BROKER_URL = "wss://broker.emqx.io:8084/mqtt";
const MQTT_TOPIC = "device/gnss/#";
```

## 本机临时预览

本机预览只适合检查页面能不能打开，不适合正式手机定位测试：

```powershell
cd <本目录>
python -m http.server 8080
```

然后在电脑浏览器访问：

```text
http://127.0.0.1:8080
```

如果手机和电脑在同一个局域网，也可以访问：

```text
http://电脑局域网IP:8080
```

但这个局域网 HTTP 地址通常不能正常使用手机定位权限。正式测试仍建议使用 HTTPS 静态托管。
