import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// import ffprobe from 'node-ffprobe-installer';

import ffmpeg from 'fluent-ffmpeg';

// import fs from 'fs';


ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// ffmpeg.setFfprobePath(ffprobe.path)

import axios from 'axios';

export const createVideoFromMP3AndImages = async (mp3Path, imageUrls, outputFilename) => {
  console.log("CREATE VIDEOOO")
    // Start building the FFmpeg command
    const command = ffmpeg();

    // Set the input audio from the local file path
    command.input(mp3Path);

    // Loop through image URLs and add them as input images with appropriate durations
    let currentTime = 0;
    for (const imageUrl of imageUrls) {
      command.input(imageUrl).duration(1).seekInput(currentTime);
      currentTime += 1;
    }

    // Set options for the output video
    command.outputOptions([
      '-c:v libx264',
      '-r 30',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
    ]);

    // Set the output file path and format
    command.output(outputFilename).format('mp4').videoCodec('libx264');;

    // Execute the FFmpeg command
    return new Promise((resolve, reject) => {
      command.on('end', resolve(outputFilename));
      command.on('error', reject);
      command.run();
    });

};

// Usage
// const mp3Path = '/path/to/audio.mp3';
// const imageUrls = [
//   'http://example.com/path/to/image1.jpg',
//   'http://example.com/path/to/image2.jpg',
//   'http://example.com/path/to/image3.jpg',
//   // Add more image URLs as needed
// ];
// const outputFilename = '/path/to/output-video.mp4';

// createVideoFromMP3AndImages(mp3Path, imageUrls, outputFilename);
