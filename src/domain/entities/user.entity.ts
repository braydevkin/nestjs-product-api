import { IUser } from '../interfaces/user-interface';

export class UserEntity {
  public user: IUser;

  private constructor(user: IUser) {
    this.user = user;
    if (!user) {
      //@ts-expect-error used for ORM
      this.user = {};
      return;
    }
  }

  static create(user: IUser) {
    return new UserEntity(user);
  }

  toJSON() {
    return this.user;
  }
}
