import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { SearchRoutesDto } from './dto/search-routes.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('api')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('routes')
  findAll(@Query() query: SearchRoutesDto) {
    const { origin, destination, date } = query;

    if (origin || destination || date) {
      return this.routesService.search(origin, destination, date);
    }

    return this.routesService.findAll();
  }

  @Get('routes/search')
  search(@Query() query: SearchRoutesDto) {
    return this.routesService.search(
      query.origin,
      query.destination,
      query.date,
    );
  }

  @Get('routes/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.routesService.findOne(id);
  }

  @Post('bookings')
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.routesService.createBooking(createBookingDto);
  }
}
