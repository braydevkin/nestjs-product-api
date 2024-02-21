import { HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserCreateUseCase } from '../../application/useCases/user/create';
import { UserCreateDTO } from './dto/user-create.dto';
import { GetUserUseCase } from '../../application/useCases/user/get';
import { IUser } from '../../domain/interfaces/user-interface';

@Injectable()
export class UserService {
  constructor(
    private userCreateUseCase: UserCreateUseCase,
    private getCreateUseCase: GetUserUseCase,
  ) {}

  async create(userCreateDTO: UserCreateDTO) {
    const userWithHasPassword: UserCreateDTO = {
      ...userCreateDTO,
      password: await bcrypt.hash(userCreateDTO.password, 10),
    };
    const { email } = await this.userCreateUseCase.execute(userWithHasPassword);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      email,
    };
  }

  readOne(query: Partial<IUser>) {
    return this.getCreateUseCase.execute(query);
  }
}
