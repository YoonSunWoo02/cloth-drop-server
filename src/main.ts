import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API 버전 prefix
  app.setGlobalPrefix('api/v1');

  // 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // DTO에 없는 필드 자동 제거
      forbidNonWhitelisted: true,
      transform: true,        // 타입 자동 변환
    }),
  );

  // CORS (Flutter 앱에서 호출 허용)
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api/v1`);
}
bootstrap();