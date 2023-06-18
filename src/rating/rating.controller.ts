import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { User } from 'src/auth/decorators/user.decorator';
import { SetRatingDTO } from './dto/set-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getRating(
    @Param('movieId', idValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @Post('set')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDTO) {
    return this.ratingService.setRating(_id, dto);
  }
}
