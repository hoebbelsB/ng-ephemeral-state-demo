import { Module } from '@nestjs/common';
import { GraphQLDefinitionsFactory, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TracksModule } from './tracks/tracks.module';

@Module({
    imports: [
        TracksModule,
        GraphQLModule.forRoot({
            autoSchemaFile: 'apps/reactive-backend/schema.gql'
        })
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService]
})
export class AppModule {
}
