export class User {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null as any;
    }
    return this._token;
  }
}
