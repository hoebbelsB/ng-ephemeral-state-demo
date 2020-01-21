import { BaseEntity } from './entity';

export interface Track extends BaseEntity {
    id: string;
    name?: string;
    albumId?: string;
    mediaTypeId?: string;
    genreId?: string;
    composer?: string;
    milliseconds?: number;
    bytes?: number;
    unitPrice?: number;
}
