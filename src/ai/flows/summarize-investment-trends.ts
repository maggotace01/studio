// Summarizes recent market activity for a given stock or the overall market.
// - summarizeInvestmentTrends - A function that takes a stock ticker or market overview as input and returns a summary of recent trends.
// - SummarizeInvestmentTrendsInput - The input type for the summarizeInvestmentTrends function, including the stock ticker or market overview.
// - SummarizeInvestmentTrendsOutput - The return type for the summarizeInvestmentTrends function, which provides a summary of recent market trends.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInvestmentTrendsInputSchema = z.object({
  ticker: z.string().optional().describe('The stock ticker symbol to summarize. If omitted, summarize the overall market.'),
});
export type SummarizeInvestmentTrendsInput = z.infer<typeof SummarizeInvestmentTrendsInputSchema>;

const SummarizeInvestmentTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of recent market trends for the specified stock or the overall market.'),
});
export type SummarizeInvestmentTrendsOutput = z.infer<typeof SummarizeInvestmentTrendsOutputSchema>;

export async function summarizeInvestmentTrends(input: SummarizeInvestmentTrendsInput): Promise<SummarizeInvestmentTrendsOutput> {
  return summarizeInvestmentTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInvestmentTrendsPrompt',
  input: {schema: SummarizeInvestmentTrendsInputSchema},
  output: {schema: SummarizeInvestmentTrendsOutputSchema},
  prompt: `You are an expert financial analyst. Provide a summary of recent market trends.

  {{#if ticker}}
  Specifically, summarize recent activity for the stock with ticker symbol {{ticker}}.
  {{else}}
  Summarize the overall market.
  {{/if}}

  Focus on key events and price movements over the last week.
  Do not give investment advice.
  `,
});

const summarizeInvestmentTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeInvestmentTrendsFlow',
    inputSchema: SummarizeInvestmentTrendsInputSchema,
    outputSchema: SummarizeInvestmentTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
