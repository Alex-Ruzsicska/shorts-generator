import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import ffprobe from 'node-ffprobe'

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import axios from 'axios';


export const createVideoFromMP3ImagesAndSubtitles = async (
  mp3Url,
  imageUrls,
  subtitles,
  outputFilename
) => {
  try {
    // Download the MP3 file
    const mp3Response = await axios.get(mp3Url, { responseType: 'arraybuffer' });
    const mp3Buffer = Buffer.from(mp3Response.data);

    // Determine the duration of the MP3 audio
    const audioDuration = await getMP3Duration(mp3Buffer);

    // Calculate the interval duration between images
    const intervalDuration = audioDuration / imageUrls.length;

    // Start building the FFmpeg command
    const command = ffmpeg();

    // Set the input audio from the MP3 buffer
    command.input(mp3Buffer);

    // Loop through image URLs and add them as input images with appropriate durations
    let currentTime = 0;
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const subtitle = subtitles[i];

      command.input(imageUrl).inputOptions('-loop 1').duration(intervalDuration).seekInput(currentTime);

      // Add subtitle overlay to the input image
      // command.complexFilter(`[1:v][0:a]overlay=10:10:enable='between(t,${currentTime},${currentTime + intervalDuration})'[outv]`);

      // Add subtitle text
      command.drawtext(10, 10, subtitle, {
        fontfile: '/path/to/fontfile.ttf',
        fontcolor: 'white',
        fontsize: '24',
        shadowcolor: 'black',
        shadowx: 2,
        shadowy: 2,
      });

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
    return new Promise((resolve, reject) => {
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
const getMP3Duration = (mp3Buffer) => {
  return new Promise((resolve, reject) => {
    ffprobe(mp3Buffer, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
};

// Usage
// const mp3Url = 'http://example.com/path/to/audio.mp3';
// const imageUrls = [
//   'http://example.com/path/to/image1.jpg',
//   'http://example.com/path/to/image2.jpg',
//   'http://example.com/path/to/image3.jpg',
//   // Add more image URLs as needed
// ];
// const subtitles = [
//   'Subtitle 1',
//   'Subtitle 2',
//   'Subtitle 3',
//   // Add more subtitles as needed
// ];
// const outputFilename = '/path/to/output-video.mp4';

// createVideoFromMP3ImagesAndSubtitles(mp3Url, imageUrls, subtitles, outputFilename);
