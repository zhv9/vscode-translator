import { Translation } from './types'
import { BingTranslator, CibaTranslator, GoogleTranslator, YoudaoTranslator } from './translator'
import * as vscode from 'vscode'
import { Display } from './display'

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const { subscriptions } = context

  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('translator')
  let engines = config.get<string[]>('engines', ['ciba', 'google'])
  let toLang = config.get<string>('toLang', 'zh')

  const displayer = new Display()

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInStatusBar',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) { return }
        await displayer.showInStatusBar(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInBubble',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) { return }
        await displayer.showInBubble(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndShowInOutputChannel',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) { return }
        await displayer.showInOutputChannel(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateAndReplace',
      async () => {
        const text = getText()
        const trans = await translate(text, engines, toLang)
        if (!trans) { return }
        await displayer.replaceWord(trans)
      }
    )
  )

  subscriptions.push(
    vscode.commands.registerCommand(
      'extension.translateWithTargetLanguage',
      async () => {
        const text = getText()
        vscode.window.showInputBox({ placeHolder: "input a target language shortcut" }).then(async toLang => {
          const trans = await translate(text, engines, toLang)
          if (!trans) { return }
          await displayer.showInOutputChannel(trans)
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
            if (!trans) { return }
            await displayer.showInOutputChannel(trans)
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
          if (!trans) { return }
          await displayer.showInOutputChannel(trans)
        })
      }
    )
  )
}

function getText(): string {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }

  const { document } = editor
  let text: string
  const selection = editor.selection
  if (selection.isEmpty) {
    const cursorPos = editor.selection.active
    const currentWordRange = document.getWordRangeAtPosition(cursorPos)
    text = document.getText(currentWordRange)
  } else {
    text = document.getText(selection)
  }

  if (text.trim() !== '') {
    return text
  } else {
    vscode.window.showWarningMessage("Empty word")
    return null
  }
}

export async function translate(
  text: string,
  engines: string[],
  toLang: string,
): Promise<Translation | void> {
  if (!text) {
    return
  }

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
    .then(results => {
      return {
        text,
        results,
        status: 1
      } as Translation
    })
    .catch(_e => {
      vscode.window.showWarningMessage("Translation failed")
      return
    })
}
