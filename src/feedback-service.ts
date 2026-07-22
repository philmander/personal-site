import { getDb } from './db.ts';

export interface FeedbackInput {
  name: string;
  email: string;
  message: string;
}

export type FeedbackErrors = Partial<Record<keyof FeedbackInput, string>>;

// Generous caps — these guard against abuse, not real users
const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;

export function validateFeedback(input: FeedbackInput): FeedbackErrors {
  const errors: FeedbackErrors = {};
  if (!input.name) {
    errors.name = 'Please tell us your name.';
  } else if (input.name.length > MAX_NAME) {
    errors.name = `Name is too long (max ${MAX_NAME} characters).`;
  }
  if (!input.email) {
    errors.email = 'Please enter your email address.';
  } else if (input.email.length > MAX_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "That doesn't look like an email address.";
  }
  if (!input.message) {
    errors.message = 'The message is the important part!';
  } else if (input.message.length > MAX_MESSAGE) {
    errors.message = `Message is too long (max ${MAX_MESSAGE} characters).`;
  }
  return errors;
}

/** Trim and coerce raw form-body values into a FeedbackInput */
export function feedbackFromBody(body: Record<string, unknown>): FeedbackInput {
  const field = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return {
    name: field(body.name),
    email: field(body.email),
    message: field(body.message),
  };
}

export async function saveFeedback(input: FeedbackInput): Promise<void> {
  await getDb()
    .insertInto('feedback')
    .values(input)
    .execute();
}
