# 看板娘音源核对

## 学长页面实际用了什么

核对页面：https://sukunahust.moe/

页面加载了两套看板娘组件：

- `D-Sketon/plugin-live2d`，默认模型来自 `live2d.fghrsh.net` 的 Potion Maker / Pio。
- `L2Dwidget`，模型为 `live2d-widget-model-shizuku@1.0.5`。

Shizuku 的模型配置确实包含录音，不是文字气泡或普通 TTS：

- 配置：https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json
- 例如 `tap_body` 动作引用 `snd/tapBody_00.mp3`、`tapBody_01.mp3`、`tapBody_02.mp3`。
- 在参考站点击模型后，浏览器实际请求了 `tapBody_02.mp3`，也观察到了 Audio 播放调用。

因此不能说“参考站没有角色音频”。但这套音频属于 **Shizuku**，不是涂山苏苏。不能把它接到苏苏身上，再标作“苏苏原声”。

## 本站现在的处理

- 本站仍使用已有的苏苏同人精灵图。
- 情境台词由本地脚本显示，不合成声音，不调用模型。
- 没有复制 Shizuku 的 MP3，也没有下载动画或游戏中的苏苏对白来发布。
- 没有克隆配音演员声音，或把普通 TTS 标成官方配音。
- 目前仍未确认可在这个公开博客中转载的苏苏原声来源。

模型 npm 包标注 GPL-2.0，但包的许可证本身不等于已核实角色、配音录音的全部权利链。以后如果引入录音，需要分别核对音源出处、允许的用途与署名要求；若换用其他角色的声音，必须明确标识，不能混称。
