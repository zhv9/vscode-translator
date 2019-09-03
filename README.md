# coc-translator

Translation extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

Inspired by [vim-translate-me](https://github.com/voldikss/vim-translate-me)

[![Build Status](https://travis-ci.org/voldikss/coc-translator.svg?branch=master)](https://travis-ci.org/voldikss/coc-translator)

## Install

```
:CocInstall coc-translator
```

## Features

- Multiple translator engines
- Export translation history
- View and process translation history via CocList
- Proxy support(see [coc.txt](https://github.com/neoclide/coc.nvim/blob/master/doc/coc.txt#L113-L119))

## Configuration

- `translator.toLang`: Target language, default: `'zh'`
- `translator.engines`: Translation engines, default: `['bing', 'ciba', 'google']`
- `translator.maxsize`: Max count of history items, default: 5000

more information, see [package.json](https://github.com/voldikss/coc-translator/blob/master/package.json)

## Engines

| engine                 | needs id/key | supported languages |
| ---------------------- | ------------ | ------------------- |
| bing                   | no           | [language list][1]  |
| ciba                   | no           | [language list][2]  |
| google                 | no           | [language list][3]  |
| youdao(not usable yet) | no           | [language list][4]  |

## Keymaps

Example

```vim
" popup
nmap <Leader>t <Plug>(coc-translator-p)
" echo
nmap <Leader>e <Plug>(coc-translator-e)
" replace
nmap <Leader>r <Plug>(coc-translator-r)
```

## Commands

- `:CocCommand translator.popup [text]` Display translation result via floating/popup window
- `:CocCommand translator.echo [text]` Echo the translation result in the cmdline
- `:CocCommand translator.replace [text]` Replace the word under the cursor with the translation
- `:CocCommand translator.exportHistory` Export translation history in the tabpage

**Note:** `[text]` is optional, if no `text`, the extension will use the `<word>` under the cursor.

## Work with translation lists

run `:CocList translation` to open the translation list.

- Filter your translation items and perform operations via `<Tab>`
- Use operation `delete` to delete the translation item under the cursor
- Use operation `yank` to yank ...
- Use operation `open` to open the file which contains the query word
- Use operation `preview` to preview ...
- Use operation `append` to append the word to the end of cursor position
- Use operation `pretend` to pretend ...

For more advance usage, checkout `:h coc-list`

## F.A.Q

Q: Where are the translation data stored?

A: Normally the data is saved in `~/.config/coc/extensions/coc-translation-data`, but if you set `g:coc_extension_root` to another location, it will change as well

## License

MIT

## Screenshots

![](https://user-images.githubusercontent.com/20282795/62059151-43256800-b255-11e9-914d-ece4addc5e7c.png)
![](https://user-images.githubusercontent.com/20282795/60385979-6b893d80-9ac2-11e9-821f-c656dd38c9fa.png)
![](https://user-images.githubusercontent.com/20282795/60385982-6f1cc480-9ac2-11e9-8519-448c6d9c77e4.png)
![](https://user-images.githubusercontent.com/20282795/60385983-704df180-9ac2-11e9-9912-96f302f66474.png)

[1]: https://github.com/voldikss/vim-translate-me/wiki/bing-api
[2]: https://github.com/voldikss/vim-translate-me/wiki/Ciba-api
[3]: https://github.com/voldikss/vim-translate-me/wiki/Google-api
[4]: https://github.com/voldikss/vim-translate-me/wiki/Youdao-api


## Donation

- Paypal

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/voldikss)

- Wechat
<div>
	<img src="https://user-images.githubusercontent.com/20282795/62786670-a933aa00-baf5-11e9-9941-6d2551758faa.jpg" width=400>
</div>
