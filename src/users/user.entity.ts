import { hash, compare } from 'bcryptjs';

export class User {
  private _password: string;

  constructor(
    private readonly _email: string,
    private readonly _name: string,
    readonly passwordHash?: string
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }

  public get password(): string {
    return this._password;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  async setPassword(password: string, salt: number): Promise<void> {
    this._password = await hash(password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
