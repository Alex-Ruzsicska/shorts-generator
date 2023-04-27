import { ChatGptAnswer } from '$/pages/api/chatgpt';

export default function useChatGpt() {
  let isLoading = false;

  const fetchAnswer = async (message: string) => {
    isLoading = true;

    const response = await fetch('api/chatgpt', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    const parsedResponse = (await response.json()) as ChatGptAnswer;

    return parsedResponse;
  };

  return {
    isChatGptLoading: isLoading,
    fetchChatGptAnswer: fetchAnswer,
  };
}
