import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: ,
  dangerouslyAllowBrowser: true
});

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful GitHub assistant that can help with repository management and issue tracking.' },
        { role: 'user', content: message }
      ],
      model: 'gpt-4',
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('OpenAI Error:', error);
    return 'Sorry, there was an error processing your request.';
  }
};