import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Usar cookie-parser para manejar las cookies
  app.use(cookieParser());

  // Habilitar CORS correctamente para permitir el envío de cookies
  app.enableCors({
    origin: process.env.FRONT_URL,  // Asegúrate de que esté configurado para tu frontend
    credentials: true,  // Esto permite que las cookies se envíen
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();