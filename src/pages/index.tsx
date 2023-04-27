import useChatGpt from '$/services/useChatGpt';
import { useEffect, useState } from 'react';
// import { string } from 'yup';

export default function Home() {
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const validateLinkValue = string().url();

  const { isChatGptLoading, fetchChatGptAnswer } = useChatGpt();

  const onChangeLink = (newValue: string) => {
    setLink(newValue);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  };

  useEffect(() => {
    (async () => {
      if (isSubmitting) {
        const message = `Escreva um texto para vender o produto deste link: ${link}`;
        const answer = await fetchChatGptAnswer(message);

        setText(answer ?? 'no answer');
      }
    })();
  }, [isSubmitting]);

  return (
    <main>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <fieldset>
            <div>
              <label>link:</label>
              <input
                onChange={(e) => onChangeLink(e.target.value)}
                value={link}
                style={{ backgroundColor: 'blue' }}
              />
            </div>
          </fieldset>
          <input type='submit' disabled={isSubmitting} />
        </form>
        <h1>{text}</h1>
      </div>
    </main>
  );
}
