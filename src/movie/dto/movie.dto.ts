import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  @MinLength(1, {
    message: 'В названии должна быть хотя бы одна буква',
  })
  name: string;

  @IsString()
  @MinLength(1, {
    message: 'В описании должна быть хотя бы одна буква',
  })
  description: string;

  @IsString()
  poster: string;
}

export class UpdateMovieDTO {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'В названии должна быть хотя бы одна буква',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'В описании должна быть хотя бы одна буква',
  })
  description: string;

  @IsOptional()
  @IsString()
  poster: string;
}
