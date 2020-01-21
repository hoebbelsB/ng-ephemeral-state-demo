/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Database } from 'sqlite3';

import { AppModule } from './app/app.module';
import { Db } from './db';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.port || 3333;
    Db.init();
    await app.listen(
        port,
        () => {
            console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
        }
    );
}

bootstrap();
