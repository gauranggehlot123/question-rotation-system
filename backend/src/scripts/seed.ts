import { connect } from 'mongoose';
import { model } from 'mongoose';
import { QuestionAssignmentSchema } from '../question-assignments/questionAssignment.schema';
import { QuestionSchema } from '../questions/question.schema';

// Initialize models
const QuestionModel = model('Question', QuestionSchema);
const QuestionAssignmentModel = model('QuestionAssignment', QuestionAssignmentSchema);

// Database connection
const uri = 'mongodb://root:example_password@localhost:27017/stroll?authSource=admin';

async function seedDatabase() {
  await connect(uri);
  
  try {
    // Check if there are existing questions
    const existingQuestions = await QuestionModel.find().countDocuments();

    if (existingQuestions === 0) {
      // Create questions for Singapore and USA
      const questions = [
        { content: 'What is the capital of Singapore?', region: 'Singapore' },
        { content: 'What is the capital of the USA?', region: 'USA' }
      ];

      // Insert questions into the database
      const insertedQuestions = await QuestionModel.insertMany(questions);

      // Create question assignments for each question with a duration of 7 days
      const questionAssignments = insertedQuestions.map(question => ({
        questionId: question._id,
        duration: 7,
      }));

      // Insert question assignments into the database
      await QuestionAssignmentModel.insertMany(questionAssignments);

      console.log('Seeding completed successfully.');
    } else {
      console.log('Database already contains data. Seeding skipped.');
    }
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await connect(uri); // Close the connection
    process.exit();
  }
}

// Run the seeding script
seedDatabase();
