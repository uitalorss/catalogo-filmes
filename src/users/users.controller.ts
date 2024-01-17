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
import { ZodValidationPipe } from '../helpers/ZodValidationPipe';
import { instanceToInstance } from 'class-transformer';
import { authGuard } from '../auth/auth.guard';
import {
  ResetPasswordDto,
  resetPasswordSchema,
} from './dto/reset-password.dto';

import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import { QueryTokenDto, queryTokenSchema } from './dto/query-token.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Cliente Cadastrado com sucesso' })
  @ApiBadRequestResponse({ description: 'Usuário com email já cadastrado' })
  public async create(
    @Res() res,
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    await this.usersService.create(createUserDto);
    return res.json({ message: 'Cliente Cadastrado com sucesso' });
  }

  @UseGuards(authGuard)
  @Get()
  public async findOne(@Req() req, @Res() res): Promise<ResponseUserDto> {
    const user = await this.usersService.findOne(req.user);
    return res.json(instanceToInstance(user));
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Token inválido' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
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

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Token inválido' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @HttpCode(204)
  @UseGuards(authGuard)
  @Delete()
  remove(@Req() req) {
    return this.usersService.remove(req.user);
  }

  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Patch('reset')
  resetPassword(
    @Query(new ZodValidationPipe(queryTokenSchema)) query: QueryTokenDto,
    @Body(new ZodValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(query, resetPasswordDto);
  }
}
