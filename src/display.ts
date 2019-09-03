import { DisplayMode, Translation } from './types'
import * as vscode from 'vscode'

class Display {

  private buildContent(trans: Translation): string[] {
    const content: string[] = []
    content.push(`@ ${trans.text} @`)
    for (const t of trans.results) {
      content.push(' ')
      content.push(`------ ${t.engine} ------`)
      if (t.phonetic) { content.push(`🔉 [${t.phonetic}]`) }
      if (t.paraphrase) { content.push(`🌀 ${t.paraphrase}`) }
      if (t.explain.length) { content.push(...t.explain.map((i: string) => "📝 " + i)) }
    }

    return content
  }

  public async winSize(content: string[]): Promise<number[]> {
    const height = content.length
    let width = 0
    for (let line of content) {
      let line_width = line.length
      if (line_width > width) { width = line_width }
    }
    return [height, width]
  }

  public async popup(trans: Translation): Promise<void> {
    const content = this.buildContent(trans)
    if (content.length === 0) { return }
    let [height, width] = await this.winSize(content)
    for (let i of Object.keys(content)) {
      let line = content[i]
      if (line.startsWith('---') && width > line.length) {
        let padding = Math.floor((width - line.length) / 2)
        content[i] = `${'-'.repeat(padding)}${line}${'-'.repeat(padding)}`
        content[i] += '-'.repeat((width - line.length) % 2)
      } else if (line.startsWith('@')) {
        let padding = Math.floor((width - line.length) / 2)
        content[i] = `${' '.repeat(padding)}${line}`
      }
    }

    const translation = content.join('\n')
    vscode.window.showInformationMessage(translation)
  }

  public async echo(trans: Translation): Promise<void> {
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
    const message = `${trans.text} ==> ${content.join(' ')}`
    vscode.window.setStatusBarMessage(message, 5000)
  }

  public async replace(trans: Translation): Promise<void> {
    // for (let t of trans.results) {
    //   if (t.paraphrase) {
    //     this.nvim.pauseNotification()
    //     this.nvim.command('let reg_tmp=@a', true)
    //     this.nvim.command(`let @a='${t["paraphrase"]}'`, true)
    //     this.nvim.command('normal! viw"ap', true)
    //     this.nvim.command('let @a=reg_tmp', true)
    //     await this.nvim.resumeNotification()
    //     return
    //   }
    // }
    // showMessage('No paraphrase for replacement')
  }
}

export async function display(
  trans: Translation,
  mode: DisplayMode
): Promise<void> {
  const displayer = new Display()

  switch (mode) {
    case 'popup':
      await displayer.popup(trans)
      break
    case 'echo':
      await displayer.echo(trans)
      break
    case 'replace':
      await displayer.replace(trans)
      break
  }
}
