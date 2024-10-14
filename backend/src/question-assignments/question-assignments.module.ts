import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionAssignmentsService } from './question-assignments.service';
import { QuestionAssignmentsController } from './question-assignments.controller';
import { QuestionAssignment, QuestionAssignmentSchema } from './questionAssignment.schema';
import { Question, QuestionSchema } from '../questions/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionAssignment.name, schema: QuestionAssignmentSchema },
      { name: Question.name, schema: QuestionSchema }
    ])
  ],
  controllers: [QuestionAssignmentsController],
  providers: [QuestionAssignmentsService],
  exports: [QuestionAssignmentsService]
})
export class QuestionAssignmentsModule {}
