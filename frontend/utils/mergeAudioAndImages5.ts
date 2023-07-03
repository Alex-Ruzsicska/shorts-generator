import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

export const createVideoFromAudioAndImages = (audioPath, imagePaths, outputFilename) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // Set the audio input
    command.input(audioPath);

    // Loop through the image paths and add them as input images
    for (const imagePath of imagePaths) {
      command.input(imagePath).duration(30);
    }

    // Set the duration of each image to the desired duration
    // const imageDuration = 30/imagePaths.length; // Duration in seconds
    // command.complexFilter([
    //   `scale=1920:1080:force_original_aspect_ratio=increase`,
    //   `setsar=1:1`,
    //   `scale=1920:1080,trim=duration=${imageDuration}`
    // ]);

    // Merge the audio and images
    command.outputOptions([
      '-c:v libx264',
      '-r 30',
      '-pix_fmt yuv420p',
      '-movflags +faststart'
    ]);

    // Set the output file path and format
    command.output(outputFilename);

    // Execute the FFmpeg command
    command.on('end', () => {
      console.log('Video creation finished');
      resolve(outputFilename);
    });

    command.on('error', (err) => {
      console.error('Video creation error:', err);
      reject(err);
    });

    command.run();
  });
};

// Usage
// const audioPath = '/path/to/audio.mp3';
// const imagePaths = [
//   '/path/to/image1.jpg',
//   '/path/to/image2.jpg',
//   '/path/to/image3.jpg'
//   // Add more image paths as needed
// ];
// const outputFilename = '/path/to/output-video.mp4';

// createVideoFromAudioAndImages(audioPath, imagePaths, outputFilename)
//   .then(() => {
//     console.log('Video creation completed');
//   })
//   .catch((error) => {
//     console.error('Video creation error:', error);
//   });
