import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() data: CreateTicketDto) {
    return this.ticketsService.create(data);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('today')
  findToday() {
    return this.ticketsService.findToday();
  }

  @Get('open')
  findOpen() {
    return this.ticketsService.findByStatus('ABIERTO');
  }

  @Get('progress')
  findProgress() {
    return this.ticketsService.findByStatus('EN_PROCESO');
  }

  @Get('resolved')
  findResolved() {
    return this.ticketsService.findByStatus('RESUELTO');
  }

  @Get('closed')
  findClosed() {
    return this.ticketsService.findByStatus('CERRADO');
  }

  @Get('number/:ticketNumber')
  findByTicketNumber(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.findByTicketNumber(Number(ticketNumber));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ticketsService.update(id, data);
  }
}
