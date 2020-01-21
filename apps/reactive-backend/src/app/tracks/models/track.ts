import { Track as BaseTrack } from '@ephemeral-angular/api';
import { Field, Float, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Track implements BaseTrack {
    @Field(type => ID)
    id: string;
    @Field({nullable: true})
    name?: string;
    @Field({nullable: true})
    albumId?: string;
    @Field({nullable: true})
    mediaTypeId?: string;
    @Field({nullable: true})
    genreId?: string;
    @Field({nullable: true})
    composer?: string;
    @Field(type => Float, {nullable: true})
    milliseconds?: number;
    @Field(type => Float, {nullable: true})
    bytes?: number;
    @Field(type => Float, {nullable: true})
    unitPrice?: number;
}
