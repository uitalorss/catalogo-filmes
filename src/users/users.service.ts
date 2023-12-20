import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { UserTokenService } from 'src/user-token/user-token.service';
import { addHours, isAfter } from 'date-fns';
import { ResetPasswordDto } from './dto/ResetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userTokenService: UserTokenService,
  ) {}

  public async create({ name, email, password }: CreateUserDto) {
    const emailUserExists = await this.userRepository.findOneBy({
      email,
    });
    if (emailUserExists) {
      throw new BadRequestException('Usuário com email já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  public async findAll() {
    return this.userRepository.find();
  }

  public async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  public async update(id: string, { name, email, password }: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      const userEmailAlreadyExists = await this.userRepository.findOneBy({
        email,
      });
      if (
        userEmailAlreadyExists &&
        userEmailAlreadyExists.email !== user.email
      ) {
        throw new BadRequestException('Esse email já está em uso.');
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = await hash(password, 8);
      user.password = hashedPassword;
    }

    return this.userRepository.save(user);
  }

  public async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  public async resetPassword(
    query: { token: string },
    resetPasswordDto: ResetPasswordDto,
  ) {
    const userToken = await this.userTokenService.findByToken(query.token);
    if (!userToken) {
      throw new NotFoundException('Token inválido');
    }
    const user = await this.userRepository.findOneBy({ id: userToken.user_id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const compareDate = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestException('Token expirado.');
    }
    const hashedPassword = await hash(resetPasswordDto.password, 8);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
