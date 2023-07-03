import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import fs from 'fs';


ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import axios from 'axios';

export const createVideoFromMP3AndImages = async (mp3Url, imageUrls, outputFilename) => {
  try {
    // Download the MP3 file
    const mp3Response = await axios.get(mp3Url, { responseType: 'arraybuffer' });
    // const mp3Buffer = Buffer.from(mp3Response.data);

    // Save MP3 buffer to a temporary file
    const tempAudioPath = '/temp/uploads/temp-audio.mp3';
    // await writeFileAsync(tempAudioPath, mp3Buffer);
    await downloadMP3(mp3Url, tempAudioPath)

    // Determine the duration of the MP3 audio
    const audioDuration = await getMP3Duration(tempAudioPath);

    // Calculate the interval duration between images
    const intervalDuration = audioDuration / imageUrls.length;

    // Start building the FFmpeg command
    const command = ffmpeg();

    // Set the input audio from the temporary file
    command.input(tempAudioPath);

    // Loop through image URLs and add them as input images with appropriate durations
    let currentTime = 0;
    for (const imageUrl of imageUrls) {
      command.input(imageUrl).duration(intervalDuration).seekInput(currentTime);
      currentTime += intervalDuration;
    }

    // Set options for the output video
    command.outputOptions([
      '-c:v libx264',
      '-r 30',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
    ]);

    // Set the output file path and format
    command.output(outputFilename);

    // Execute the FFmpeg command
    await new Promise((resolve, reject) => {
      command.on('end', resolve);
      command.on('error', reject);
      command.run();
    });

    console.log('Video creation finished');
  } catch (error) {
    console.error('Video creation error:', error);
  }
};

// Helper function to get the duration of an MP3 audio
const getMP3Duration = (mp3FilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(mp3FilePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
};

const downloadMP3 = async (url, outputFilename) => {
  console.log("URL: ", url, outputFilename)
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const outputStream = fs.createWriteStream(outputFilename);
    response.data.pipe(outputStream);

    return new Promise((resolve, reject) => {
      outputStream.on('finish', ()=>resolve(outputFilename));
      outputStream.on('error', (error)=>{
        console.log(error);
        reject();
      });
    });

    console.log('Download completed');
  } catch (error) {
    console.error('Download error:', error);
  }
};

// Utility function to write a file asynchronously
// const writeFileAsync = (filePath, data) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filePath, data, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });
// };

// Usage
const mp3Url = 'http://example.com/path/to/audio.mp3';
const imageUrls = [
  'http://example.com/path/to/image1.jpg',
  'http://example.com/path/to/image2.jpg',
  'http://example.com/path/to/image3.jpg',
  // Add more image URLs as needed
];
const outputFilename = '/path/to/output-video.mp4';

createVideoFromMP3AndImages(mp3Url, imageUrls, outputFilename);
