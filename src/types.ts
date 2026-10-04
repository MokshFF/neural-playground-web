export type SimulatorType = 
  | 'neural_network' 
  | 'sorting' 
  | 'attention' 
  | 'gradient_descent' 
  | 'convolution' 
  | 'pathfinding'
  | 'generic';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RealWorldExample {
  title: string;
  story: string;
  analogy: string;
}

export interface ConceptData {
  concept: string;
  tagline: string;
  category: string;
  simpleExplanation: string;
  underTheHood: string;
  realWorldExample: RealWorldExample;
  simulatorType: SimulatorType;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  suggestedQuestions: string[];
}

export interface GroundingSource {
  title?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  isGrounded?: boolean;
}

export interface QuizAttempt {
  concept: string;
  score: number;
  total: number;
  timestamp: number;
}

export interface UserProgress {
  exploredConcepts: string[];
  masteredConcepts: string[];
  quizAttempts: QuizAttempt[];
  streak: number;
  totalXp: number;
}
