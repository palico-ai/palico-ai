export class TagLogger {
  readonly TAG: string

  constructor (tag: string) {
    this.TAG = tag
  }

  log (message: any): void {
    console.log(`[${this.TAG}] `, message)
  }

  error (message: string): void {
    console.error(`[${this.TAG}] ${message}`)
  }

  warn (message: string): void {
    console.warn(`[${this.TAG}] ${message}`)
  }
}
