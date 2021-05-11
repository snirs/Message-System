import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'

const port = process.env.PORT || 3000;

async function bootstrap() {
  const serverConfig = config.get('server')
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });
  await app.listen(port);
}
bootstrap();
