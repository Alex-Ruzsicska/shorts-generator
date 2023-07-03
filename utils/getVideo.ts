import videoshow from 'videoshow';

export const getVideo = async(audio, images, output)=>{
    const videoOptions = {
        fps: 25,
        loop: 5, // seconds
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
    }
    return new Promise((resolve, reject)=>{
        videoshow(images, videoOptions)
        .audio(audio)
        .save(output)
        .on('error', function (err) {
            reject(err)
        })
        .on('end', function (output) {
            resolve(output)
        })

    })
       

}