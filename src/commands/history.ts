import { Translation, HistoryItem } from '../types'
import * as vscode from 'vscode'
import { DB } from '../utils/db'
import { showMessage } from '../utils/util'

export class History {
  constructor(private db: DB, private enableHistory: boolean) { }

  public async save(trans: Translation): Promise<void> {
    if (!this.enableHistory) return
    let text: string = trans.text
    for (const t of trans.results) {
      let paraphrase = t.paraphrase
      let explain = t.explain
      let item = []

      if (explain.length !== 0) {
        item = [text, explain[0]]
      } else if (paraphrase && text.toLowerCase() !== paraphrase.toLowerCase()) {
        item = [text, paraphrase]
      }

      if (item.length) {
        await this.db.add(item as HistoryItem)
      }
    }
  }

  public async export(): Promise<void> {
    if (!this.enableHistory) {
      showMessage('History feature was not enabled', 'warning')
      return
    }
    const content = await this.db.load()
    vscode.workspace.openTextDocument({ language: 'json' }).then((doc: vscode.TextDocument) => {
      vscode.window.showTextDocument(doc).then((e: vscode.TextEditor) => {
        e.edit((editBuilder: vscode.TextEditorEdit) => {
          editBuilder.insert(new vscode.Position(0, 0), JSON.stringify(content, null, 2))
        })
      })
    })
  }
}
