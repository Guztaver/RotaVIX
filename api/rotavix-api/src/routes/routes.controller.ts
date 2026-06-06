import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchRoutesDto } from './dto/search-routes.dto';
import { RoutesService } from './routes.service';

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

  @Get('bookings')
  getBookings(@Query('username') username?: string) {
    if (!username) {
      const { UnauthorizedException } = require('@nestjs/common');
      throw new UnauthorizedException('Acesso negado: username obrigatório.');
    }
    return this.routesService.getBookingsByUsername(username);
  }

  @Delete('bookings/:id')
  deleteBooking(
    @Param('id', ParseIntPipe) id: number,
    @Query('username') username?: string,
  ) {
    if (!username) {
      const { UnauthorizedException } = require('@nestjs/common');
      throw new UnauthorizedException('Acesso negado: username obrigatório.');
    }
    return this.routesService.deleteBooking(id, username);
  }
}
