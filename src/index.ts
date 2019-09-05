import path from 'path'
import * as vscode from 'vscode'
import {
  BingTranslator,
  CibaTranslator,
  Display,
  GoogleAPILanguageMap,
  GoogleTranslator,
  YoudaoTranslator,
  History
} from './commands'
import { Translation, SingleTranslation } from './types'
import { statAsync, mkdirAsync, DB } from './utils'
import { getConfigDir, showMessage } from './utils/util'

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const { subscriptions } = context

  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('translator')
  let engines = config.get<string[]>('engines', ['ciba', 'bing'])
  let toLang = config.get<string>('toLang', 'Chinese')
  let translateOnHover = config.get<boolean>('translateOnHover', false)
  let enableHistory = config.get<boolean>('enableHistory', false)

  const configDir = getConfigDir()
  const storagePath = path.join(configDir, 'vscode-browser-completion')
  const stat = await statAsync(storagePath)
  if (!stat || !stat.isDirectory()) {
    await mkdirAsync(storagePath)
  }

  const displayer = new Display()
  const db = new DB(storagePath, 5000)
  const history = new History(db, enableHistory)

  subscriptions.push(
    vscode.languages.registerHoverProvider(['*'], {
      async provideHover(document, position, _token): Promise<vscode.Hover> {
        if (!translateOnHover) return
        const text = getText(document, position)
        const trans = await translate(text, engines, toLang)
        if (!trans) return
        const contents = displayer.buildForFloatingWindow(trans)
        return new vscode.Hover(contents)
      }
    })
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateOnHoverEnable',
      () => translateOnHover = true
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateOnHoverDisable',
      () => translateOnHover = false
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInStatusBar',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) return
        await displayer.showInStatusBar(trans)
        await history.save(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInBubble',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) return
        await displayer.showInBubble(trans)
        await history.save(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInOutputChannel',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) return
        await displayer.showInOutputChannel(trans)
        await history.save(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndReplace',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) return
        await displayer.replaceWord(trans)
        await history.save(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateWithTargetLanguage',
      async () => {
        const text = getText()
        const languages = [...GoogleAPILanguageMap.keys()]
        vscode.window.showQuickPick(languages, { placeHolder: "select a target language" })
          .then(async toLang => {
            const trans = await translate(text, engines, toLang)
            if (!trans) return
            await displayer.showInOutputChannel(trans)
            await history.save(trans)
          })
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateWithEngine',
      async () => {
        const text = getText()
        const engineSet = ['bing', 'google', 'ciba']
        vscode.window.showQuickPick(engineSet, { canPickMany: true })
          .then(async engines => {
            const trans = await translate(text, engines, toLang)
            if (!trans) return
            await displayer.showInOutputChannel(trans)
            await history.save(trans)
          })
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateNewWord',
      async () => {
        vscode.window.showInputBox({ placeHolder: "input a word" }).then(async text => {
          const trans = await translate(text, engines, toLang)
          if (!trans) return
          await displayer.showInOutputChannel(trans)
          await history.save(trans)
        })
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateHistoryExport',
      async () => await history.export()
    )
  )
}

function getText(document?: vscode.TextDocument, position?: vscode.Position): string {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  if (!document) document = editor.document

  let text = ''
  let range: vscode.Range
  const selection = editor.selection
  if (selection.isEmpty) {
    // no selection or hover position, select current word
    if (!position) position = editor.selection.active
    range = document.getWordRangeAtPosition(position)
  } else {
    // has selection, no hover position
    if (!position) {
      range = new vscode.Range(selection.start, selection.end)
    } else {
      // if hover position is in the selection area
      if (selection.anchor.line === position.line
        && position.character >= selection.start.character
        && position.character <= selection.end.character) {
        range = new vscode.Range(selection.start, selection.end)
      } else {
        // hover position is not in the selection area
        range = document.getWordRangeAtPosition(position)
      }
    }
  }
  text = document.getText(range)
  if (text.trim() !== '') return text
  showMessage('Empty word')
  return null
}

export async function translate(
  text: string,
  engines: string[],
  toLang: string,
): Promise<Translation | void> {
  if (!text || text.trim() === '') return

  const ENGINES = {
    bing: BingTranslator,
    ciba: CibaTranslator,
    google: GoogleTranslator,
    youdao: YoudaoTranslator
  }

  const translatePromises = engines.map(e => {
    const cls = ENGINES[e]
    const translator = new cls(e)
    return translator.translate(text, toLang)
  })

  return Promise.all(translatePromises)
    .then((results: SingleTranslation[]) => {
      results = results.filter(result => {
        return result.status === 1 &&
          !(result.explain.length === 0 && result.paraphrase === '')
      })
      return {
        text,
        results
      } as Translation
    })
    .catch(_e => {
      showMessage('Translation failed', 'error')
      return
    })
}
