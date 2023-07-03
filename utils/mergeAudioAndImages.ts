import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const mergeAudioAndImages = async (audioUrl, imageUrls, outputFilename) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    imageUrls.forEach((imageUrl) => {
      command.input(imageUrl).loop(40);
    });

    command.input(audioUrl);

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