 /* eslint-disable */

import axios from 'axios';

import { File } from 'buffer';

import { PollyResponse } from '$/pages/api/polly';

export default function useGenerateVideo() {

  const generateVideo = async (audioUrl: string, images: File[], subtitles: string) => {
    console.log("GENERATE")
    const formData = new FormData();

    console.log(images)

    images.forEach((file) => {
      formData.append('images', file, file.name);
    });

    formData.append('audio', audioUrl)

    formData.append('subtitles', subtitles)


   console.log("form:", formData.get('audio'))

    const response = await axios.post('api/generateVideo', formData,{
      headers:{
          'Content-Type': 'multipart/form-data'
      }
    });

    console.log("RESS: ", response)

    return response;

    // const parsedResponse = (await response.json()) as PollyResponse;

    // return parsedResponse;
  };

  return {
    generateVideo,
  };
}
