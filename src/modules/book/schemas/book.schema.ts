import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, Length } from 'class-validator';
import { RoleTypes } from '@/core/enums/role.enum';

export type BookDocument = Book & Document;

@Schema({
  versionKey: false,
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class Book {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
