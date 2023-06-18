import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './movie.model';
import { Model, Types } from 'mongoose';
import { CreateMovieDTO, UpdateMovieDTO } from './dto/movie.dto';
import { User } from 'src/user/user.model';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movie: Model<Movie>) {}

  async getById(id: string): Promise<Movie> {
    const movie = await this.movie
      .findById(id)
      .populate({ path: 'user', select: 'login id' });

    if (!movie) {
      throw new NotFoundException('Фильм не найден');
    }

    return movie;
  }

  async getAll(): Promise<Movie[]> {
    return this.movie
      .find({})
      .sort({ rating: -1 })
      .populate({ path: 'user', select: 'login id' })
      .exec();
  }

  async create(
    userId: Types.ObjectId,
    movieDTO: CreateMovieDTO,
  ): Promise<Movie> {
    const movie = await this.movie.findOne({ name: movieDTO.name });

    if (movie) {
      throw new BadRequestException('Фильм с таким названием уже есть');
    }
    const newMovie = new this.movie({
      name: movieDTO.name,
      description: movieDTO.description,
      poster: movieDTO.poster,
      user: userId,
    });
    return newMovie.save();
  }

  async update(
    id: string,
    user: User,
    updateMovieDTO: UpdateMovieDTO,
  ): Promise<Movie> {
    const movie = await this.getById(id);

    if (String(movie.user._id) !== String(user._id) && !user.isAdmin) {
      throw new ForbiddenException(
        'У Вас недостаточно прав для редактирования данной записи',
      );
    }

    const sameName = await this.movie.findOne({ name: updateMovieDTO.name });

    if (sameName && String(sameName._id) !== id) {
      throw new BadRequestException('Фильм с таким названием уже есть');
    }

    const updateMovie = await this.movie
      .findByIdAndUpdate(id, updateMovieDTO, {
        new: true,
      })
      .populate({ path: 'user', select: 'login id' });

    return updateMovie;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movie
      .findByIdAndUpdate(
        id,
        {
          rating: newRating,
        },
        { new: true },
      )
      .exec();
  }

  async delete(user: User, id: string): Promise<Movie> {
    const deleteMovie = await this.getById(id);

    if (String(deleteMovie.user._id) !== String(user._id) && !user.isAdmin) {
      throw new ForbiddenException(
        'У Вас недостаточно прав для удаления данной записи',
      );
    }

    if (!deleteMovie) {
      throw new NotFoundException('Фильм не найден');
    }

    deleteMovie.deleteOne();

    return deleteMovie;
  }
}
