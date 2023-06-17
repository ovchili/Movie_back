import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieModel } from './movie.model';
import { Model } from 'mongoose';
import { MovieDTO } from './dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(@InjectModel(MovieModel.name) private movie: Model<MovieModel>) {}

  async getById(id: string): Promise<MovieModel> {
    const movie = await this.movie.findById(id);

    if (!movie) {
      throw new NotFoundException('Фильм не найден');
    }

    return movie;
  }

  async getAll(): Promise<MovieModel[]> {
    return this.movie.find({}).exec();
  }

  async create(movieDTO: MovieDTO): Promise<MovieModel> {
    const newMovie = new this.movie(movieDTO);
    return newMovie.save();
  }

  async update(id: string, updateMovieDTO: MovieDTO): Promise<MovieModel> {
    const updateMovie = await this.movie.findByIdAndUpdate(id, updateMovieDTO, {
      new: true,
    });

    if (!updateMovie) {
      throw new NotFoundException('Фильм не найден');
    }

    return updateMovie;
  }

  async delete(id: string): Promise<MovieModel> {
    const deleteMovie = await this.movie.findById(id);

    if (!deleteMovie) {
      throw new NotFoundException('Фильм не найден');
    }

    deleteMovie.deleteOne();

    return deleteMovie;
  }
}
