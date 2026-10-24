export interface CashClosing {
  opening: number
  counted: number | null
}

export interface CashClosingInput {
  opening: number | string
  counted: number | string
}
