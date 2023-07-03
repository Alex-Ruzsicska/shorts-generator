 /* eslint-disable */

import type { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_CHATGPT_MODEL = 'gpt-3.5-turbo';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_ROLE_USER = 'user';

export type ChatGptAnswer = {
  answer: string | undefined;
  error: string | undefined;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatGptAnswer>) {
  const { message } = JSON.parse(req.body);

  const bodyMessage = {
    role: OPENAI_ROLE_USER,
    content: message,
  };

  const requestBody = {
    model: DEFAULT_CHATGPT_MODEL,
    messages: [bodyMessage],
  };

  const response = await fetch(OPENAI_API_URL, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY_32}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();

  const hasAnswer = !!(responseData?.choices && responseData.choices.length);

  const answer = (hasAnswer ? responseData?.choices[0].message?.content : undefined) as
    | string
    | undefined;

  if (answer) {
    res.status(200).json({ answer } as ChatGptAnswer);
  } else {
    res.status(response.status).json({ error: responseData?.error?.message } as ChatGptAnswer);
  }
}
