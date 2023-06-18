import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { UserDTO } from './dto/user.dto';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: UserDTO) {
    const sameLogin = await this.user.findOne({ login: user.login });
    if (sameLogin) {
      throw new BadRequestException(
        'Пользователь с указанным логином уже существует',
      );
    }

    const salt = await genSalt(10);
    const newUser = await new this.user({
      login: user.login,
      password: await hash(user.password, salt),
    }).save();

    const tokens = await this.issueTokenPair(String(newUser._id));

    return { user: this.returnUserFields(newUser), ...tokens };
  }

  async login(dto: UserDTO) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(String(user._id));

    return { user: this.returnUserFields(user), ...tokens };
  }

  async validateUser(dto: UserDTO): Promise<User> {
    const user = await this.user.findOne({ login: dto.login });

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Пароль неверный');

    return user;
  }

  async getNewTokens(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Пожалуйста, войдите в систему');
    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result)
      throw new UnauthorizedException('Неверный токен или токен истек');

    const user = await this.user.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));

    return { user: this.returnUserFields(user), ...tokens };
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: User) {
    return {
      _id: user._id,
      login: user.login,
      isAdmin: user.isAdmin,
    };
  }
}
