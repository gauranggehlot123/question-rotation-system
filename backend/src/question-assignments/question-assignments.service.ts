import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionAssignment } from './questionAssignment.schema';
import { Question } from '../questions/question.schema';

@Injectable()
export class QuestionAssignmentsService {
  constructor(
    @InjectModel(QuestionAssignment.name)
    private questionAssignmentModel: Model<QuestionAssignment>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // Create a new Question Assignment with logic to determine the correct startDate
  async createQuestionWithAssignment(
    questionData: Partial<Question>,
    duration: number,
  ): Promise<QuestionAssignment> {
    // Step 1: Create the new question
    debugger;
    const newQuestion = new this.questionModel(questionData);
    const savedQuestion = await newQuestion.save();

    // Step 2: Fetch the latest question assignment in the same region
    const latestQuestionInRegion = await this.questionAssignmentModel
      .findOne({})
      .populate({
        path: 'questionId',
        match: { region: questionData.region }, // Match region from the associated question
      })
      .sort({ startDate: -1 }) // Sort by start date in descending order
      .exec();

    console.log('latestQuestionInRegion--', latestQuestionInRegion);

    let newStartDate = new Date(); // Default to now if no previous questions exist

    // Ensure that the populated question has a matching region before proceeding
    if (latestQuestionInRegion && latestQuestionInRegion.questionId) {
      // Calculate new start date based on the latest question's end date (startDate + duration)
      const lastQuestionEndDate = new Date(latestQuestionInRegion.startDate);
      lastQuestionEndDate.setDate(
        lastQuestionEndDate.getDate() + latestQuestionInRegion.duration,
      );
      newStartDate = lastQuestionEndDate;
    }

    console.log('newStartDate---', newStartDate);
    // Step 3: Create the new question assignment
    const newQuestionAssignment = new this.questionAssignmentModel({
      questionId: savedQuestion._id,
      startDate: newStartDate.toISOString(),
      duration: duration,
      isActive: true,
    });

    return newQuestionAssignment.save();
  }

  // Create a new Question Assignment
  async create(
    createQuestionAssignmentDto: Partial<QuestionAssignment>,
  ): Promise<QuestionAssignment> {
    const newQuestionAssignment = new this.questionAssignmentModel(
      createQuestionAssignmentDto,
    );
    return newQuestionAssignment.save();
  }

  // Get all Question Assignments
  async findAll(): Promise<QuestionAssignment[]> {
    return this.questionAssignmentModel.find({ isActive: true }).exec();
  }

  // Get a single Question Assignment by ID
  async findOne(id: string): Promise<QuestionAssignment> {
    const questionAssignment = await this.questionAssignmentModel
      .findById(id)
      .exec();
    if (!questionAssignment || !questionAssignment.isActive) {
      throw new NotFoundException(
        `QuestionAssignment with ID "${id}" not found or inactive.`,
      );
    }
    return questionAssignment;
  }

  // Update a Question Assignment by ID
  async update(
    id: string,
    updateQuestionAssignmentDto: Partial<QuestionAssignment>,
  ): Promise<QuestionAssignment> {
    const updatedQuestionAssignment = await this.questionAssignmentModel
      .findByIdAndUpdate(id, updateQuestionAssignmentDto, { new: true })
      .exec();

    if (!updatedQuestionAssignment || !updatedQuestionAssignment.isActive) {
      throw new NotFoundException(
        `QuestionAssignment with ID "${id}" not found or inactive.`,
      );
    }
    return updatedQuestionAssignment;
  }

  // Find questions by region
  async findQuestionsByRegion(region: string): Promise<Question[]> {
    return this.questionModel.find({ region }).exec();
  }

  // Update the current assigned questions
  async updateCurrentAssignment(region: string): Promise<void> {
    await this.questionAssignmentModel.updateMany(
      { region, isActive: true },
      { $set: { isActive: false } },
    );
    await this.createQuestionWithAssignment({ region }, 7);
  }

  // Soft delete a Question Assignment by ID
  async remove(id: string): Promise<QuestionAssignment> {
    const deletedQuestionAssignment = await this.questionAssignmentModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!deletedQuestionAssignment) {
      throw new NotFoundException(
        `QuestionAssignment with ID "${id}" not found.`,
      );
    }
    return deletedQuestionAssignment;
  }

  // Get all Question Assignments along with their associated question data
  async findAllWithQuestions(): Promise<QuestionAssignment[]> {
    try {
      return await this.questionAssignmentModel
        .find()
        .populate('questionId')
        .exec();
    } catch (error) {
      console.error('Error in findAllWithQuestions:', error);
      throw new Error('Failed to fetch question assignments with questions');
    }
  }

  // Get Currenrt Question Assignments Specific to the regions
  async getCurrentAssignments(): Promise<
    Array<QuestionAssignment & { question: Question }>
  > {
    const today = new Date();
    console.log('Current date:', today);

    const currentAssignments = await this.questionAssignmentModel.aggregate([
      {
        $addFields: {
          questionIdObj: { $toObjectId: '$questionId' },
          endDate: {
            $add: [
              '$startDate',
              { $multiply: ['$duration', 24 * 60 * 60 * 1000] },
            ],
          },
        },
      },
      {
        $match: {
          isActive: true,
          startDate: { $lte: today }, // The assignment should have started
          endDate: { $gte: today }, // The assignment should not have ended
        },
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'questionIdObj',
          foreignField: '_id',
          as: 'question',
        },
      },
      {
        $unwind: '$question',
      },
      {
        $match: {
          'question.isActive': true,
        },
      },
      {
        $sort: { startDate: 1 }, // Sort by start date ascending (queue-like order)
      },
      {
        $group: {
          _id: '$question.region',
          assignment: { $first: '$$ROOT' }, // Take the earliest assignment for each region
        },
      },
      {
        $replaceRoot: { newRoot: '$assignment' },
      },
      {
        $project: {
          _id: 1,
          questionId: 1,
          startDate: 1,
          duration: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          question: 1,
          endDate: 1,
        },
      },
    ]);

    console.log(
      'Aggregation result:',
      JSON.stringify(currentAssignments, null, 2),
    );

    // Handle expired assignments
    const updatedAssignments = await Promise.all(
      currentAssignments.map(async (assignment) => {
        if (assignment.endDate < today) {
          // Assignment has expired, update isActive to false
          await this.questionAssignmentModel.findByIdAndUpdate(assignment._id, {
            isActive: false,
          });
          return null; // Remove this assignment from the results
        }
        return assignment;
      }),
    );

    // Filter out null values (expired assignments)
    const finalAssignments = updatedAssignments.filter(
      (assignment) => assignment !== null,
    );

    console.log('Final result:', JSON.stringify(finalAssignments, null, 2));
    return finalAssignments;
  }

  // Get Upcoming Question Assignments Specific to the regions as per their start date
  async getUpcomingAssignments(): Promise<
    Array<QuestionAssignment & { question: Question }>
  > {
    const today = new Date();
    console.log('Current date:', today);
    debugger;
    // First, get the current assignments to exclude them
    const currentAssignments = await this.getCurrentAssignments();
    const currentQuestionIds = currentAssignments.map((assignment) =>
      assignment.questionId.toString(),
    );

    const upcomingAssignments = await this.questionAssignmentModel.aggregate([
      {
        $match: {
          isActive: true,
          startDate: { $gt: today }, // Only future assignments
          questionId: { $nin: currentQuestionIds }, // Exclude current assignments
        },
      },
      {
        $addFields: {
          questionIdObj: { $toObjectId: '$questionId' },
          endDate: {
            $add: [
              '$startDate',
              { $multiply: ['$duration', 24 * 60 * 60 * 1000] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'questionIdObj',
          foreignField: '_id',
          as: 'question',
        },
      },
      {
        $unwind: '$question',
      },
      {
        $match: {
          'question.isActive': true,
        },
      },
      {
        $sort: { startDate: 1 }, // Queue-like: sort by start date ascending
      },
      {
        $group: {
          _id: '$question.region',
          assignment: { $first: '$$ROOT' }, // Select the earliest upcoming assignment per region
        },
      },
      {
        $replaceRoot: { newRoot: '$assignment' },
      },
      {
        $project: {
          _id: 1,
          questionId: 1,
          startDate: 1,
          duration: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          question: 1,
          endDate: 1,
        },
      },
    ]);

    console.log(
      'Aggregation result:',
      JSON.stringify(upcomingAssignments, null, 2),
    );

    return upcomingAssignments;
  }
}
