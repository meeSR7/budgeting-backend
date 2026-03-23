import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,  
    private jwtService: JwtService
  ) {}
   async register(dto: RegisterDto) {

    const existingUser = await this.userService.findByEmail(dto.email);

    if(existingUser){
      throw new BadRequestException("User with this email already exists, please choose another email");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userService.createUser(dto.email, hashedPassword, dto.name);

    return {
      message: `User with  email: ${newUser.email} registered successfully`
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    }

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      message: 'Login successful',
    };
  }
  
}
