import { z } from 'zod';

// Base types
export interface BrevoContact {
  email?: string;
  id?: number;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  listIds?: number[];
  attributes?: Record<string, any>;
}

export interface EmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: {
    name: string;
    email: string;
  };
}

export interface ContactAttribute {
  name: string;
  category: string;
  type: string;
  value?: string;
}

// Zod schemas
export const ContactSchema = z.object({
  email: z.string().email().optional(),
  id: z.number().optional(),
  emailBlacklisted: z.boolean().optional(),
  smsBlacklisted: z.boolean().optional(),
  listIds: z.array(z.number()).optional(),
  attributes: z.record(z.string(), z.any()).optional()
});

export const EmailOptionsSchema = z.object({
  to: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional()
  })),
  subject: z.string(),
  htmlContent: z.string(),
  sender: z.object({
    name: z.string(),
    email: z.string().email()
  }).optional()
});
