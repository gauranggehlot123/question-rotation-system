import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  region: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
