import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 랜덤 4자리 태그 생성
  private generateTag(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // 회원가입
  async register(dto: RegisterDto) {
    // 이메일 중복 확인
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 태그 생성
    const tag = this.generateTag();

    // 저장
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      nickname: dto.nickname,
      tag,
    });
    await this.userRepository.save(user);

    return { nickname: user.nickname, tag: user.tag };
  }

  // 로그인
  async login(dto: LoginDto) {
    // 유저 확인
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    // 토큰 발급
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
      user: { nickname: user.nickname, tag: user.tag },
    };
  }
}
