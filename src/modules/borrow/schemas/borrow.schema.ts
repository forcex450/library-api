import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BorrowDocument = Borrow & Document;

@Schema({
  versionKey: false,
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class Borrow {
  @Prop()
  bookName: string;

  @Prop()
  bookId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 0 })
  star: number;

  @Prop({ default: false })
  checked: boolean;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
