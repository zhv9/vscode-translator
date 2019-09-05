import { Translation } from '../types'
import * as vscode from 'vscode'

export class Display {
  private buildForOutputChannel(trans: Translation): string[] {
    const content: string[] = []
    content.push(trans.text)
    for (const t of trans.results) {
      content.push(' ')
      content.push(`------ ${t.engine} ------`)
      if (t.phonetic) { content.push(`🔉 [${t.phonetic}]`) }
      if (t.paraphrase) { content.push(`📕 ${t.paraphrase}`) }
      if (t.explain.length) { content.push(...t.explain.map((i: string) => "📝 " + i)) }
    }
    return content
  }

  private buildForStatusBarAndBubble(trans: Translation): string {
    let hasPhonetic = false
    let hasParaphrase = false
    let hasExplain = false
    const content = []
    for (const t of trans.results) {
      if (t.phonetic && !hasPhonetic) {
        content.push(`[${t.phonetic}]`)
        hasPhonetic = true
      }
      if (t.paraphrase && !hasParaphrase) {
        content.push(t.paraphrase)
        hasParaphrase = true
      }
      if (t.explain.length !== 0 && !hasExplain) {
        content.push(t.explain.join('; '))
        hasExplain = true
      }
    }
    const output = `${trans.text} ==> ${content.join(' ')}`
    return output
  }

  // floating window on hover
  public buildForFloatingWindow(trans: Translation): string {
    let hasPhonetic = false
    let hasParaphrase = false
    let hasExplain = false
    const content: string[] = []
    let explainCache = null
    let paraphraseCache = null
    content.push('[vscode-translator] ' + '`' + trans.text + '`')
    for (const t of trans.results) {
      if (t.phonetic && !hasPhonetic) {
        content.push(`🔉 [${t.phonetic}]`)
        hasPhonetic = true
      }
      if (t.paraphrase && !hasParaphrase) {
        if (hasPhonetic) {
          content.push(`📕 ${t.paraphrase}`)
          hasParaphrase = true
        } else {
          paraphraseCache = t.paraphrase
        }
      }
      if (t.explain.length !== 0 && !hasExplain) {
        if (hasParaphrase) {
          content.push(...t.explain.map((i: string) => "📝 " + i))
          hasExplain = true
        } else {
          explainCache = t.explain
        }
      }
    }
    if (!hasParaphrase && paraphraseCache) {
      content.push(`📕 ${paraphraseCache}`)
    }
    if (!hasExplain && explainCache) {
      content.push(...explainCache.map((i: string) => "📝 " + i))
    }
    return content.join('\n\r')
  }

  // normal: output channel
  public async showInOutputChannel(trans: Translation): Promise<void> {
    const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('translator')
    const content = this.buildForOutputChannel(trans)
    if (content.length === 0) { return }
    for (const line of content) {
      outputChannel.appendLine(line)
    }
    outputChannel.show()
    outputChannel.dispose()
  }

  // bubble at right bottom
  public async showInBubble(trans): Promise<void> {
    const message = this.buildForStatusBarAndBubble(trans)
    vscode.window.showInformationMessage(message)
  }

  // echo in the status bar
  public async showInStatusBar(trans: Translation): Promise<void> {
    const message = this.buildForStatusBarAndBubble(trans)
    vscode.window.setStatusBarMessage(message, 5000)
    // const statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    // statusBar.text = message
    // statusBar.show()
    // statusBar.dispose()
  }

  // replace current word with translation
  public async replaceWord(trans: Translation): Promise<void> {
    const editor = vscode.window.activeTextEditor
    for (const t of trans.results) {
      if (t.paraphrase) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
          const selection = editor.selection
          if (selection.isEmpty) {
            const cursorPos = editor.selection.active
            const range = editor.document.getWordRangeAtPosition(cursorPos)
            editBuilder.replace(range, t.paraphrase)
          } else {
            editBuilder.replace(selection, t.paraphrase)
          }
        })
        return
      }
    }
  }
}
