import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { fastifyHelmet } from 'fastify-helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { RequestLogInterceptor } from '@core/interceptors/request-log.interceptor';
import { HttpExceptionFilter } from '@core/filters/http-expection.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RequestLogInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000).then(() => {
    logger.log('Application is running on: 3000');
    //initializeHelmet(app, logger);
    initializeSwagger(app, logger);
  });
}
bootstrap();

function initializeSwagger(app, logger): void {
  const config = new DocumentBuilder()
    .setTitle('bookmark')
    .setDescription('The bookmark API description')
    .setVersion('1.0')
    .addTag('book')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  logger.log('Swagger document initialized');
}

async function initializeHelmet(app, logger) {
  console.log(app.register);
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });
  logger.log('Helmet initialized');
}
