import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Res,
  UsePipes,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from './helpers/ZodValidationPipe';
import { instanceToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @HttpCode(201)
  public async create(@Res() res, @Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return res.json({ message: 'Cliente Cadastrado com sucesso' });
  }

  @Get()
  public async findAll(@Res() res) {
    const users = await this.usersService.findAll();
    return res.json(instanceToInstance(users));
  }

  @Get(':id')
  public async findOne(@Res() res, @Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return res.json(instanceToInstance(user));
  }

  @HttpCode(204)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
