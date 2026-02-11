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

const prompt = ai.definePrompt({
  name: 'aiHelpForAlertsPrompt',
  input: {schema: AIHelpForAlertsInputSchema},
  output: {schema: AIHelpForAlertsOutputSchema},
  prompt: `You are an AI assistant for a cattle farm manager. When an alert event occurs, you provide static advice on how to respond to the alert.

Alert Event: {{{alertEvent}}}

Advice: `,
});

const aiHelpForAlertsFlow = ai.defineFlow(
  {
    name: 'aiHelpForAlertsFlow',
    inputSchema: AIHelpForAlertsInputSchema,
    outputSchema: AIHelpForAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
