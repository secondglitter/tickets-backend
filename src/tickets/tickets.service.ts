import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) {}

    async create(data: any) {

  let priority = data.priority || 'MEDIO';

  // regla automática
  if (
    data.area === 'RECEPCION_TA' ||
    data.area === 'RECEPCION_TB'
  ) {
    priority = 'URGENTE';
  }

  return this.prisma.ticket.create({
    data: {
      reporterName: data.reporterName,
      area: data.area,
      category: data.category,
      description: data.description,
      priority: priority,
    },
    select: {
      ticketNumber: true,
    },
  });
}

async findAll() {
  return this.prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findToday() {

  const today = new Date();
  today.setHours(0,0,0,0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.prisma.ticket.findMany({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findByStatus(status: any) {
  return this.prisma.ticket.findMany({
    where: {
      status,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findByTicketNumber(ticketNumber: number) {
  return this.prisma.ticket.findUnique({
    where: { ticketNumber }
  });
}

async update(id: string, data: any) {
  return this.prisma.ticket.update({
    where: { id },
    data,
  });
}

}


