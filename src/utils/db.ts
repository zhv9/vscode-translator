import { statAsync, writeFileAsync, readFileAsync } from './io'
import { HistoryItem } from '../types'
import path from 'path'

export class DB {
  private file: string

  constructor(directory: string, private maxsize: number) {
    this.file = path.join(directory, 'translation.json')
  }

  public async load(): Promise<HistoryItem[]> {
    let stat = await statAsync(this.file)
    if (!stat || !stat.isFile()) return []
    let content = await readFileAsync(this.file)
    return JSON.parse(content) as HistoryItem[]
  }

  public async add(content: HistoryItem): Promise<void> {
    let items = await this.load()
    if (items.length === this.maxsize) {
      items.pop()
    }

    // check duplication
    let arr = items.map(item => item[0].toLowerCase())
    if (arr.indexOf(content[0].toLowerCase()) >= 0) return

    items.unshift(content)
    await writeFileAsync(this.file, JSON.stringify(items, null, 2))
  }
}
