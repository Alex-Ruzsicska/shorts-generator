import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

AWS.config.credentials = new AWS.Credentials(
    process.env.32_ACCESS_KEY as string,
    process.env.32_SECRET_KEY as string
)

AWS.config.region = process.env.32_REGION;

const getAudioUrl = (text: string)=>{
    const input = {
        Engine: 'neural' ,
        Text: text ,
        OutputFormat: 'mp3',
        VoiceId: 'Camila',
        LanguageCode: 'pt-BR'
     };

    const signer = new AWS.Polly.Presigner();

    return new Promise<string>((resolve, reject)=>{
        

        signer.getSynthesizeSpeechUrl(input, (error, data) => {
            if(data) {
                resolve(data)
            }
            reject (error.message)
        });
    })
}
 

export interface PollyResponse {audioUrl: string | undefined, error: string | undefined}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PollyResponse>) {
    const { text } = JSON.parse(req.body);
  
    try{
        const audioUrl = await getAudioUrl(text);
        res.status(200).json({audioUrl} as PollyResponse)
    }catch(error){
        res.status(500).json({error} as PollyResponse)
    }
}