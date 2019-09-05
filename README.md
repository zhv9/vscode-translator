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

### Commands

| 命令                                       | 说明                           |
| ------------------------------------------ | ------------------------------ |
| `Translate and Show in Statusbar`          | 翻译并在状态栏显示             |
| `Translate and Show in Bubble`             | 翻译并在右下角弹出             |
| `Translate and Show in OutputChannel`      | 翻译并在 OutputChannel 显示    |
| `Translate and Replace`                    | 翻译并用翻译结果替换当前词     |
| `Translate with Specified Target Language` | 指定目标语言翻译               |
| `Translate with Specified Engine`          | 使用指定的几个翻译接口进行翻译 |
| `Translate a New Word`                     | 输入一个单词并翻译             |

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
