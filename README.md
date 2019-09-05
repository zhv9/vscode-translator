# vscode-translator

VS Code 翻译插件，移植自 [coc-translator](https://github.com/voldikss/coc-translator)

## 功能介绍 & 使用说明

- 选中要翻译的部分，执行翻译命令

- 执行翻译命令时，如果未选中单词，默认翻译光标下的单词

- 可以同时使用多个翻译接口

- 可以保存并查看历史记录

- 悬停翻译(由于使用的非官方接口，所以此功能默认关闭，可手动打开)

- 翻译替换

### Configurations

| 设置                          | 可选值                                                                                          | 默认值             | 说明                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------- |
| `translator.engines`          | `bing`, `ciba`, `google`                                                                        | `['bing', 'ciba']` | 默认使用的翻译接口，必须是 `array` 形式的值 |
| `translator.toLang`           | `Chinese`, `English`, `Spanish`, `Japanese`, `Italian`, `Korean`, `French`, `German`, `Russian` | `Chinese`          | 默认的目标语言                              |
| `translator.translateOnHover` | `true`, `false`                                                                                 | `false`            | 鼠标悬停于单词上方时进行翻译                |
| `translator.enableHistory`    | `true`, `false`                                                                                 | `false`            | 每次翻译后自动将翻译记录保存                |

### Commands

| 命令                                       | 说明                                       |
| ------------------------------------------ | ------------------------------------------ |
| `Translate onHover Enable`                 | 打开悬停翻译                               |
| `Translate onHover Disable`                | 关闭悬停翻译                               |
| `Translate and Show in Statusbar`          | 翻译并在状态栏显示                         |
| `Translate and Show in Bubble`             | 翻译并在右下角弹出                         |
| `Translate and Show in OutputChannel`      | 翻译并在 OutputChannel 显示                |
| `Translate and Replace`                    | 翻译并用翻译结果替换当前词（并不总是有效） |
| `Translate with Specified Target Language` | 指定目标语言翻译                           |
| `Translate with Specified Engine`          | 使用指定的几个翻译接口进行翻译             |
| `Translate a New Word`                     | 输入一个单词并翻译                         |
| `Translate History Export`                 | 导出翻译历史记录                           |

## 翻译接口

| 接口                 | 国内直连？ | 需要 id/key ？ |
| -------------------- | ---------- | -------------- |
| 必应                 | 可         | 否             |
| 词霸                 | 可         | 否             |
| 谷歌                 | 可         | 否             |
| 有道(not usable yet) | 可         | 否             |

## 命令

## License

MIT

## Screenshots

<div>
    <img src="https://user-images.githubusercontent.com/20282795/64344334-d3a75300-d020-11e9-98e4-8de382fc2b0d.png" width=800>
    <img src="https://user-images.githubusercontent.com/20282795/64344335-d43fe980-d020-11e9-9729-3b534d1f83ee.png" width=800>
    <img src="https://user-images.githubusercontent.com/20282795/64344700-91324600-d021-11e9-836d-c231aba4ec30.png" width=800>
    <img src="https://user-images.githubusercontent.com/20282795/64344394-ef125e00-d020-11e9-97fa-4b72c7440bcc.gif" width=800>
    <img src="https://user-images.githubusercontent.com/20282795/64344336-d4d88000-d020-11e9-88c9-c96983c3e4c2.png" width=800>
</div>
