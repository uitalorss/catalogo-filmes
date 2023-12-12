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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const emailUserExists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (emailUserExists) {
      throw new BadRequestException('Usuário com email já cadastrado');
    }

    const user = this.userRepository.create({
      ...createUserDto,
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

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      ...updateUserDto,
      id,
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.userRepository.save(user);
  }

  public async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
