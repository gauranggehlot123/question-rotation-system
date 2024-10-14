import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './question.schema';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async create(question: Partial<Question>): Promise<Question> {
    const newQuestion = new this.questionModel(question);
    return newQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id).exec();
  }

  async update(id: string, question: Partial<Question>): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(id, question, { new: true }).exec();
  }

  async remove(id: string): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }
}
