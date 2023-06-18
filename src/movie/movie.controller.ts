import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDTO, UpdateMovieDTO } from './dto/movie.dto';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { Types } from 'mongoose';
import { User as UserModel } from 'src/user/user.model';

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

  @Auth()
  @HttpCode(HttpStatus.OK)
  @Post()
  @UsePipes(new ValidationPipe())
  async createMovie(
    @User('_id') id: Types.ObjectId,
    @Body() movie: CreateMovieDTO,
  ) {
    return this.movieService.create(id, movie);
  }

  @Auth()
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateMovie(
    @User() user: UserModel,
    @Param('id', idValidationPipe)
    id: string,
    @Body() updateMovieDTO: UpdateMovieDTO,
  ) {
    return this.movieService.update(id, user, updateMovieDTO);
  }

  @Auth()
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteMovie(
    @User() user: UserModel,
    @Param('id', idValidationPipe) id: string,
  ) {
    return this.movieService.delete(user, id);
  }
}
