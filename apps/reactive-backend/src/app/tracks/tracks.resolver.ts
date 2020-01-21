import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { Observable } from 'rxjs';
import { NewTrackInput } from './dto/new-track.input';
import { TracksArgs } from './dto/tracks.args';
import { Track } from './models/track';
import { TracksService } from './tracks.service';

const pubSub = new PubSub();

@Resolver(of => Track)
export class TracksResolver {
    constructor(private readonly tracksService: TracksService) {
    }

    @Query(returns => Track)
    track(@Args('id') id: string): Observable<Track> {
        return this.tracksService.findOneById(id);
    }

    @Query(returns => [Track])
    tracks(@Args() recipesArgs: TracksArgs): Observable<Track[]> {
        return this.tracksService.findAll(recipesArgs);
    }

    @Mutation(returns => Track)
    async addTrack(
        @Args('newRecipeData') newRecipeData: NewTrackInput
    ): Promise<Track> {
        const recipe = await this.tracksService.create(newRecipeData);
        pubSub.publish(
            'recipeAdded',
            { recipeAdded: recipe }
        );
        return recipe;
    }

    @Mutation(returns => Boolean)
    async removeTrack(@Args('id') id: string) {
        return this.tracksService.remove(id);
    }

    @Subscription(returns => Track)
    trackAdded() {
        return pubSub.asyncIterator('trackAdded');
    }
}
