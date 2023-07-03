import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

import multer from 'multer';
import axios from 'axios';
import * as fs from 'fs'

import mergeAudioAndImages from '../../../utils/mergeAudioAndImages';

import { v4 as uuidv4 } from 'uuid';
import { resolve } from 'path';
import { rejects } from 'assert';

interface GenerateVideoResponse {
    url: string | undefined,
    error: string | undefined,
}

const asyncDownloadMP3 = async (url: string, outputFilename: string) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });
  
      const outputStream = fs.createWriteStream(outputFilename);
      response.data.pipe(outputStream);
  
      return new Promise((resolve, reject) => {
        outputStream.on('finish', resolve(outputFilename));
        outputStream.on('error', reject('Failed to download'));
      });
  
    } catch (error) {
        throw Error("Failed to donwload.")
    }
};


const upload = multer({
    storage: multer.diskStorage({
        destination: './temp/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
})

const uploadVideoToS3 = (videoPath, id)=>{
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string
  })

  const fileContent = fs.readFileSync(videoPath);

  const params = {
    Bucket: process.env.AWS_VIDEOS_BUCKET,
    Key: `${id}.mp4`,
    Body: fileContent,
    ACL: 'public-read',
  }

  return new Promise((resolve, reject)=>
  {
    s3.upload(params, (err, data)=>{
      console.log(err,data)
      if(err){
        reject(err)
      }
      else{
        resolve(data.Location)
      }
    })
  })
 
  
  
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GenerateVideoResponse>) {
    upload.array('images')(req, res, async (err) => {
        const id = uuidv4();
        const folder = `${id}/`
        const audio = `${process.env.FILE_SYSTEM_FOLDER}${id}.mp3`
        const video = `${process.env.FILE_SYSTEM_FOLDER}${id}.mp4`

        console.log("HERE: ", audio, video);


        if (err) {
            console.error('Upload error', err);
            return res.status(500).json({ error: 'Error uploading files' } as GenerateVideoResponse);
        }

        const audioUrl = req.body.audio
        // const audioUri =  await asyncDownloadMP3(audioUrl, audio);        
        const imagesPaths = req.files.map((image)=>`./${image.path}`);

        try{
            const videoUri = await mergeAudioAndImages(audioUrl, imagesPaths, video);

            const videoUrl = await uploadVideoToS3(videoUri, id);

            console.log("urll: ", videoUrl)

            res.status(200).json({ url: videoUrl } as GenerateVideoResponse);
        }catch(error){
          res.status(500).json({ error } as GenerateVideoResponse);
        }
  });
}

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };