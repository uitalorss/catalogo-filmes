import { Evaluation } from 'src/evaluation/entities/evaluation.entity';
import { Artist } from '../entities/artist.entity';
import { ContentRating } from '../entities/contentRating.entity';
import { Genre } from '../entities/genre.entity';

export class ResponseFilmDto {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  duration: number;
  genres: Genre[];
  artists: Artist[];
  evaluations: Evaluation[];
  contentRating: ContentRating;
  created_at: Date;
  updated_at: Date;
}
