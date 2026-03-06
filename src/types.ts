
export type AppStep = 'permissions' | 'verification' | 'app' | 'locked';

export interface PromptInputs {
  goal: string;
  context: string;
  style: string;
  format: string;
  length: string;
  audience: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isFinal?: boolean;
}

export interface WebhookResponse {
  status: 'valid' | 'invalid' | 'expired';
  daysRemaining?: number;
  automationUrl?: string;
  message?: string;
}

export enum MathOperation {
  ADD = '+'
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: MathOperation;
  answer: number;
}
