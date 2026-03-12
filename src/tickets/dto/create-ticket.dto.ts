import { Area, Category } from '@prisma/client';

export class CreateTicketDto {
  reporterName: string
  area: Area
  category: Category
  description: string
}