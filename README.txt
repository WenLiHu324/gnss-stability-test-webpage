GNSS 稳定性测试网页稳定版

使用方式：
1. 将 index.html 和 mqtt.min.js 放在同一目录。
2. 推荐部署到 HTTPS 静态服务器后用手机访问。
3. 在页面 MQTT Topic 输入框中填写 topic，例如 DEVICE_REPORT/235829352，然后点击“订阅 MQTT”。
4. 页面会订阅 wss://broker.emqx.io:8084/mqtt。收到包含 longitude 字段的 MQTT 数据后自动开始测试。
5. 导出 CSV 时按 MQTT 数据、手机定位数据、场景/动作标注分段输出。

注意：
- 手机定位需要 HTTPS 或 localhost 环境。
- 当前公网临时链接依赖本机 cloudflared 隧道，不属于长期稳定部署。
