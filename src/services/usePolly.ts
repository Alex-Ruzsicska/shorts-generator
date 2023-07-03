import { PollyResponse } from '$/pages/api/polly';

export default function usePolly() {
  let isLoading = false;

  const fetchAudioUrl = async (text: string) => {
    isLoading = true;

    const response = await fetch('api/polly', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    const parsedResponse = (await response.json()) as PollyResponse;

    return parsedResponse;
  };

  return {
    isPollyLoading: isLoading,
    fetchAudioUrl,
  };
}
