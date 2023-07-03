import type { NextApiRequest, NextApiResponse } from 'next';

import multer from 'multer';

import { Readable } from 'stream';

import axios from 'axios';

import * as fs from 'fs'
import { parse } from 'path';
import mergeAudioAndImages from '../../../utils/mergeAudioAndImages';

import { createVideoFromMP3AndImages } from "../../../utils/mergeAudioAndImages4"

import AWS from 'aws-sdk';

AWS.config.credentials = new AWS.Credentials(
    process.env.AWS_ACCESS_KEY as string,
    process.env.AWS_SECRET_KEY as string
)

interface GenerateVideoResponse {
    url: string | undefined,
    error: string | undefined,
}

const upload = multer({
    storage: multer.diskStorage({
        destination: './temp/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
})

const uploadVideoToS3 = async (videoPath)=>{
    const s3 = new AWS.S3({
        params: {
          Bucket: process.env.AWS_VIDEOS_BUCKET
        }
      });

      return new Promise((resolve, reject)=>{
        s3.upload({
            Key: 'video.mp4',
            Body: fs.createReadStream(videoPath)
          }, function(err, data) {
            if (err) {
              console.error('Error uploading video:', err);
              reject(err)
              return;
            }
        
            resolve(data)
            console.log('Video uploaded successfully:', data);
          });
      })
     
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GenerateVideoResponse>) {
    upload.array('images')(req, res, async (err) => {
        if (err) {
            console.error('Upload error', err);
            return res.status(500).json({ error: 'Error uploading files' } as GenerateVideoResponse);
        }

        const audioUrl = req.body.audio

        const subtitles = req.body.subtitles;
        
        const imagesPaths = req.files.map((image)=>`./${image.path}`);

        try{
            const videoUri = await createVideoFromMP3AndImages(audioUrl, imagesPaths, "/temp/uploads/video.mp4");
            console.log("URI: ",videoUri)
            // const videoUrl = await uploadVideoToS3(videoUri)
            // console.log(videoUrl)
        }catch(error){
            console.log("ERROR:", error)
        }
        
        res.status(200).json({ url: 'Files uploaded successfully' } as GenerateVideoResponse);
  });




    // res.status(200).json({ url: 'vai ter a URL aqui.'} as GenerateVideoResponse);
}

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };
