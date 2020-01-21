import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field, Float, InputType } from 'type-graphql';

@InputType()
export class NewTrackInput {
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
