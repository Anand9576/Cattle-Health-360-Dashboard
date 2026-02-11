'use server';

/**
 * @fileOverview An AI agent that provides static advice for common alert events.
 *
 * - aiHelpForAlerts - A function that handles the alert assistance process.
 * - AIHelpForAlertsInput - The input type for the aiHelpForAlerts function.
 * - AIHelpForAlertsOutput - The return type for the aiHelpForAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIHelpForAlertsInputSchema = z.object({
  alertEvent: z.string().describe('The name of the alert event.'),
});
export type AIHelpForAlertsInput = z.infer<typeof AIHelpForAlertsInputSchema>;

const AIHelpForAlertsOutputSchema = z.object({
  advice: z.string().describe('Static advice on how to respond to the alert.'),
});
export type AIHelpForAlertsOutput = z.infer<typeof AIHelpForAlertsOutputSchema>;

export async function aiHelpForAlerts(input: AIHelpForAlertsInput): Promise<AIHelpForAlertsOutput> {
  return aiHelpForAlertsFlow(input);
}

const aiHelpForAlertsFlow = ai.defineFlow(
  {
    name: 'aiHelpForAlertsFlow',
    inputSchema: AIHelpForAlertsInputSchema,
    outputSchema: AIHelpForAlertsOutputSchema,
  },
  async () => {
    // In Limited Mode, we bypass the LLM and return a standard menu response as requested.
    return {
      advice: "I am currently operating in Limited Mode. I cannot process specific queries yet.\n\nQuick Actions:\n1. Call Vet (Ext 911)\n2. View Critical Alerts\n3. Download Logs"
    };
  }
);
