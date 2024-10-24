export class Token {
  static key: string = "APP_TOKEN";

  static set(val: string) {
    localStorage.setItem(this.key, val);
  }

  static get() {
    return localStorage.getItem(this.key);
  }
}
