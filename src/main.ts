import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'

async function bootstrap() {
  const serverConfig = config.get('server')
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });
  await app.listen(3000);
}
bootstrap();
