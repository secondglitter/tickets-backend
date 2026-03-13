import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONT_URL, // La URL de tu frontend (por ejemplo, 'http://localhost:3000')
    credentials: true,  // Permite enviar cookies en las peticiones
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();