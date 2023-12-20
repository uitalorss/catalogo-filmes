import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpCode,
  Res,
  Put,
  UseGuards,
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, partialUserSchema } from './dto/update-user.dto';
import { ZodValidationPipe } from './helpers/ZodValidationPipe';
import { instanceToInstance } from 'class-transformer';
import { authGuard } from 'src/auth/auth.guard';
import { ResetPasswordDto } from './dto/ResetPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  public async create(
    @Res() res,
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    await this.usersService.create(createUserDto);
    return res.json({ message: 'Cliente Cadastrado com sucesso' });
  }

  @UseGuards(authGuard)
  @Get()
  public async findOne(@Req() req, @Res() res) {
    const user = await this.usersService.findOne(req.user);
    return res.json(instanceToInstance(user));
  }

  @HttpCode(204)
  @UseGuards(authGuard)
  @Put()
  update(
    @Req() req,
    @Body(new ZodValidationPipe(partialUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @HttpCode(204)
  @UseGuards(authGuard)
  @Delete()
  remove(@Req() req) {
    return this.usersService.remove(req.user);
  }

  @HttpCode(204)
  @Patch('reset')
  resetPassword(
    @Query() query: { token: string },
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.usersService.resetPassword(query, resetPasswordDto);
  }
}
