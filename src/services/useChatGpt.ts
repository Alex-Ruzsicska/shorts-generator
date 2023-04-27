const DEFAULT_CHATGPT_MODEL = 'gpt-3.5-turbo';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ROLE_USER = 'user';

type ChatGptAnswer = string | undefined;

export default function useChatGpt(chatGptModel = DEFAULT_CHATGPT_MODEL) {
  let isLoading = false;

  const fetchAnswer = async (message: string) => {
    const apiMessage = {
      role: OPENAI_ROLE_USER,
      content: message,
    };

    const requestBody = {
      model: chatGptModel,
      messages: [apiMessage],
    };

    isLoading = true;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    const hasAnswer = !!(responseData?.choices && responseData.choices.length);

    const answer = (
      hasAnswer ? responseData?.choices[0].message?.content : undefined
    ) as ChatGptAnswer;

    isLoading = false;

    return answer;
  };

  return {
    isChatGptLoading: isLoading,
    fetchChatGptAnswer: fetchAnswer,
  };
}

export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  // ...
}
