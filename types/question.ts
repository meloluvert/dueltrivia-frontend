
export type IQuestion = {
  id?: number
  //statement -> /question
  //question -> /trivia
  statement?: string;
  question?: string;
  difficulty: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type IQuestionsResponse = {
  questions: IQuestion[];
};
