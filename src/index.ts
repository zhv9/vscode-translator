import { DisplayMode, Translation } from './types'
import { translate } from './translator'
import { display } from './display'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('extension.translate', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const selection = editor.selection
    const text: string = editor.document.getText(selection)

    await manager('echo', text)
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }

async function manager(mode: DisplayMode, text?: string): Promise<void> {
  if (text === undefined) {
    // text = (await nvim.eval("expand('<cword>')")).toString()
    text = 'manager'
  }
  const result: Translation = await translate(text)
  if (!result.status) {
    console.log('Translation failed', 'error')
    return
  }
  await display(result, mode)
}
