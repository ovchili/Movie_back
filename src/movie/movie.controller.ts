import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDTO } from './dto/movie.dto';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/:id')
  async getMovie(@Param('id', idValidationPipe) id: string) {
    return this.movieService.getById(id);
  }

  @Get()
  async getAllMovies() {
    return this.movieService.getAll();
  }

  @Post()
  async createMovie(@Body() movie: MovieDTO) {
    return this.movieService.create(movie);
  }

  @Put(':id')
  async updateMovie(
    @Param('id', idValidationPipe) id: string,
    @Body() updateMovieDTO: MovieDTO,
  ) {
    return this.movieService.update(id, updateMovieDTO);
  }

  @Delete('/:id')
  async deleteMovie(@Param('id', idValidationPipe) id: string) {
    return this.movieService.delete(id);
  }
}
