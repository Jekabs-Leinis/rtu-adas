export class User {
  constructor(
    public id: string = "",
    public name: string = "",
    public password: string = "",
    public isAdmin: boolean = false,
  ) {}

  static fromJson(json: any): User {
    return new User(
      json.id,
      json.name,
      json.password,
      json.isAdmin,
    );
  }
}
