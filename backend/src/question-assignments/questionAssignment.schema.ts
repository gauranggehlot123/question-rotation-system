import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuestionAssignment extends Document {
  @Prop({ type: String, required: true, ref: 'Question' })
  questionId: string;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const QuestionAssignmentSchema = SchemaFactory.createForClass(QuestionAssignment);
