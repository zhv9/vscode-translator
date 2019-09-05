import crypto from 'crypto'
import path from 'path'
import { xhr, XHROptions } from 'request-light'
import { MsgType } from '../types'
import * as vscode from 'vscode'

export async function request(
  type: string,
  url: string,
  data: object = null,
  headers: object = null,
  responseType = 'json'
): Promise<any> {
  // const httpConfig = workspace.getConfiguration('http')
  // configure(
  //   httpConfig.get<string>('proxy', undefined),
  //   httpConfig.get<boolean>('proxyStrictSSL', undefined)
  // )

  if (!headers) {
    headers = {
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
    }
  }

  let post_data: string = null
  if (type === 'POST') {
    post_data = JSON.stringify(data)
  } else if (data) {
    url = url + '?' + urlencode(data)
  }

  const options: XHROptions = {
    type,
    url,
    data: post_data || null,
    headers,
    timeout: 5000,
    followRedirects: 5,
    responseType
  }

  try {
    let response = await xhr(options)
    let { responseText } = response
    if (responseType === 'json') {
      return JSON.parse(responseText)
    } else {
      return responseText
    }
  } catch (e) {
    // showMessage(e['responseText'], 'error')
    return
  }
}

function urlencode(data: object): string {
  return Object.keys(data).map(key =>
    [key, data[key]].map(encodeURIComponent).join("="))
    .join("&")
}

export function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex')
}

export function getConfigDir(): string {
  let configDir: string
  const platform = process.platform
  switch (platform) {
    case 'win32':
      configDir = path.join(process.env.LOCALAPPDATA || process.env.APPDATA)
      break
    case 'darwin':
      configDir = path.join(process.env.HOME, 'Library')
      break
    case 'linux':
      configDir = path.join(process.env.HOME, '.config')
      break
    default:
      break
  }
  return configDir
}

export function showMessage(message: string, type?: MsgType): void {
  switch (type) {
    case 'info':
      vscode.window.showInformationMessage(message)
      break
    case 'warning':
      vscode.window.showWarningMessage(message)
      break
    case 'error':
      vscode.window.showErrorMessage(message)
      break
    default:
      break
  }
}
