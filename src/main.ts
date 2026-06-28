// main bootstrap: configure app, static uploads, cookies, CORS and validation
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // ensure `uploads` directory exists for static assets
  const uploadsPath = join(process.cwd(), 'uploads');

  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // serve uploaded files under /uploads
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // parse cookies for auth (access token stored in cookie)
  app.use(cookieParser());

  // enable CORS to allow frontend to call API with credentials
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // global validation pipe: sanitize and transform incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WoodCraft CMS API')
    .setDescription(
      'API documentation for the WoodCraft public website and admin CMS dashboard.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT || 3001);
}

void bootstrap();
