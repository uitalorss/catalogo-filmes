import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  title: string;
  @IsString()
  synopsis: string;
  @IsNumber()
  year: number;
  @IsNumber()
  duration: number;
  @IsArray()
  genres: string[];
  @IsArray()
  artists: string[];
  @IsString()
  contentRating: 'Livre | "+12" | "+14" | "+16" | "+18"';
}
