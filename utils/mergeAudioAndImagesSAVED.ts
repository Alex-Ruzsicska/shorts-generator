import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import ID3 from 'node-id3';

import fs from 'fs'


import getMP3Duration from 'get-mp3-duration';

import mp3Duration from 'mp3-duration'

import * as mm from 'music-metadata'

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const mergeAudioAndImages = async (audioUrl, imageUrls, outputFilename) => {
  // const audioDuration = await getAudioDuration(audioUrl)
  // const audioDuration = await getAudioDuration(audioUrl)
  const audioDuration = 30;
  console.log('DURATION: ', audioDuration)



  return new Promise((resolve, reject) => {
    const command = ffmpeg();


    // Add input audio file

    // Loop through image URLs and add them as input images
    const intervalDuration = audioDuration/imageUrls.length

    // let currentTime = 0
    imageUrls.forEach((imageUrl) => {
      command.input(imageUrl);
      // command.input(imageUrl).duration(intervalDuration).seekInput(currentTime);
      // currentTime += intervalDuration;
    });

    command.input(audioUrl);


    // command.duration(30)



    // const imageDuration = 5; // Duration in seconds
    // command.complexFilter([
    //   `scale=1920:1080:force_original_aspect_ratio=increase`,
    //   `setsar=1:1`,
    //   `scale=1920:1080,trim=duration=${intervalDuration}`
    // ]);

    // Set options for the output video
    command.outputOptions([
      // '-c:v libx264',
      // '-r 30',
      // '-pix_fmt yuv420p',
      // '-movflags +faststart',
      // '-t 30'
    ]);

   

    // Map inputs and apply overlay filter for each image
    // const strings = 

    // command.complexFilter([
    //   'nullsrc=size=1280x720 [base]',
    //   '[0:a] apad',
    //   '[base][1:v] overlay=shortest=1 [temp1]',
    //   // '[temp1][2:v] overlay=shortest=1 [temp2]',
    //   // '[temp2][3:v] overlay=shortest=1 [temp3]',
    //   // // Repeat the pattern for additional images...
    //   // '[temp3][4:v] overlay=shortest=1',
    // ]);

    // Set the output file path and format
    command.output(outputFilename);

    // Execute the FFmpeg command
    command.on('end', () => {
      console.log('Video creation finished');
      resolve(outputFilename); // Resolve the Promise with the output URL
    });

    command.on('error', (err) => {
      console.error('Video creation error:', err);
      reject(err); // Reject the Promise if an error occurs
    });

    command.run();
  });
};

export default mergeAudioAndImages

// const getAudioDuration = async (audioPath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(audioPath, (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       } 

//       // console.log("DATA: ", data)

//       // const tags = ID3.read(data);
//       // console.log("DATA: ", tags.raw)

//       // const duration = tags && tags.duration;

//       // const duration = getMP3Duration(data)


//       // if (duration) {
//       //   resolve(duration);
//       // } else {
//       //   reject(new Error('Unable to retrieve audio duration.'));
//       // }
//     });
//   });
// };

// const getAudioDuration = async (audioPath) => {
//   try {
//     const metadata = await mm.parseFile(audioPath);
//     const duration = metadata.format.duration;
//     return duration;
//   } catch (error) {
//     throw new Error('Error retrieving audio duration: ' + error.message);
//   }
// };

// const getAudioDuration = (audioPath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(audioPath, (err, metadata) => {

//       console.log(metadata)
//       if (err) {
//         reject(err);
//       } else {
//         const duration = metadata.format.duration;
//         resolve(duration);
//       }
//     });
//   });
// };


// Usage
// const audioUrl = '/path/to/input-audio.mp3';
// const imageUrls = [
//   '/path/to/image1.jpg',
//   '/path/to/image2.jpg',
//   '/path/to/image3.jpg',
//   // Add more image URLs as needed
// ];

// mergeAudioAndImages(audioUrl, imageUrls)
//   .then((outputUrl) => {
//     console.log('Output video URL:', outputUrl);
//     // Use the output URL as needed
//   })
//   .catch((error) => {
//     console.error('Error creating video:', error);
//   });
