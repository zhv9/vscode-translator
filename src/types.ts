export declare type TranslationStatus = 0 | 1

export interface SingleTranslation {
  engine: string
  phonetic: string
  paraphrase: string
  explain: string[]
}
export interface Translation {
  text: string
  results: SingleTranslation[]
  status: TranslationStatus
}
