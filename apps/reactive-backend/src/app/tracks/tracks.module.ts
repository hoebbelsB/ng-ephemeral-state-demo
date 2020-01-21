import { Module } from '@nestjs/common';
import { TracksResolver } from './tracks.resolver';
import { TracksService } from './tracks.service';

@Module({
    providers: [TracksResolver, TracksService]
})
export class TracksModule {
}
