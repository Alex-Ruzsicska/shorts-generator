/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';

import ImagesDropZone from '$/components/ImagesDropZone/ImagesDropZone';
import useChatGpt from '$/services/useChatGpt';
import useGenerateVideo from '$/services/useGenerateVideo';
import usePolly from '$/services/usePolly';
import {
  Autocomplete,
  Button,
  Container,
  Grid,
  TextField,
  withStyles,
  CircularProgress,
} from '@mui/material';
import { File } from 'buffer';
// import { string } from 'yup';

import ReactPlayer from 'react-player';

import ImageInput from '../components/ImageInput';

import styles from '../styles.module.css';

import DownloadButton from '../components/downloadButton';

function Home() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const isButtonEnabled = text && images && images.length && !loading;

  const { fetchChatGptAnswer } = useChatGpt();
  const { fetchAudioUrl } = usePolly();
  const { generateVideo } = useGenerateVideo();

  const generateAd = async (productLink: string, productImages) => {
    setLoading(true);
    const message = `Escreva um texto de até 50 palavras pra vender este produto: ${productLink}`;
    const { answer } = await fetchChatGptAnswer(message);

    console.log('ANSWER: ', answer);

    if (typeof answer === 'string') {
      const audioUrl = (await fetchAudioUrl(answer)).audioUrl as string;

      const { data } = await generateVideo(audioUrl, productImages, answer);

      console.log('audio: ', data);

      if (data && data.url) {
        setUrl(data.url);
      }

      console.log(audioUrl);
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   console.log(link);
  //   if (link) {
  //     generateAd(link);
  //   }
  // }, [link]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Gerador de Anúncios</h1>
        <h2 className={styles.subTitle}>
          Insira o link de um produto, uma imagem e gere automaticamente um vídeo anúncio!
        </h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '100px',
        }}
      >
        <div className={styles.inputContainer}>
          <h2 className={styles.subTitle}>1. Insira o link do produto:</h2>
          <input
            type={'text'}
            className={styles.input}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            value={text}
          />
        </div>
        <div className={styles.inputContainer}>
          <h2 className={styles.subTitle}>2. Selecione sua imagem:</h2>
          <ImageInput onChange={setImages} />
        </div>
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            display: 'flex',
          }}
        >
          <Button
            sx={{
              color: 'white',
              backgroundColor: isButtonEnabled ? 'black' : 'lightGray',
              height: '60px',
            }}
            onClick={async () => {
              await generateAd(text, images);
            }}
            disabled={!isButtonEnabled}
          >
            GERAR ANÚNCIO
          </Button>
        </div>
      </div>
      <div
        style={{
          // backgroundColor: 'white',
          height: '100%',
          padding: '50px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <CircularProgress hidden={!loading} />
        ) : url ? (
          <DownloadButton url={url} filename={'anuncio.mp4'} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Home;
