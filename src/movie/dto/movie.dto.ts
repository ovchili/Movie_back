import { IsString, MinLength } from 'class-validator';

export class MovieDTO {
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
}
