export class Stock {
  constructor(
    public symbol: string,
    public name: string,
    public price: number,
    public isTrade: boolean,
    public history: string
  ) {
  }
}