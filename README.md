<h1 align="center">
<br>
Projetos 2 - Gerador de vídeo/anúncio
</h1>

## Teste aqui!: [Gerador de Anúncios](https://shorts-generator-32qn06o9w-alex-ruzsicska-s-team.vercel.app/)

## Descrição

<p align="start">Projeto desenvolvido para a disciplina de Projeto Integrado 2. Tendo como objetivo a construção de uma aplicação Web que seja capaz de gerar anúncios de produtos em vídeo automaticamente.</p>
<p align="start">A aplicação possui dois inputs, um para a inserção do link de um produto e o segundo para seleção de uma imagem. Esses parâmetros são então utilizados para gerar um vídeo/anúncio, contendo uma narração em áudio e a imagem ao fundo.</p>

## Tecnologias

[//]: # 'Add the features of your project here:'

- **[FFmpeg](https://ffmpeg.org/)** — Ferramenta utilizada para manipular imagens, áudio e gera o vídeo .mp4.
- **[ChatGPT](https://openai.com/chatgpt)** - IA utilizada para gerar o texto que será narrado.
- **[Amazon Polly](https://aws.amazon.com/pt/polly/)** - Serviço utilizado para converter o texto gerado em uma narração .mp3.

## Arquitetura

<p align="start">A aplicação web é estruturada em um monorepo utilizando NextJs. Esta tecnologia permite a implementação de uma página web e de serverless functions no mesmo repositório. A página web principal se encontra no arquivo "/src/pages/index.tsx", enquando o back-end, ou seja, as funções serverless que estarão rodando no servidor e serão acessadas utilizando requisições HTTP estão na pasta "/src/pages/api/".</p>

<p align="start">A estrutura de interação entre front-end e back-end para gerar o vídeo pode ser visuzalisada no seguinde diagrama:</p>

<div>
  <img src="https://i.imgur.com/ZOOct3Z.png" alt="demo" height="425">
</div>

<br/>
A nivel de código, as funções utilizadas para criar o vídeo são as seguintes:

- **generateAd (/src/pages/index.tsx):**
  Função responsável por receber as imagens, o link para o produto e chamar todas as outras funções envolvidas no processo de gerar o vídeo.

- **fetchChatGptAnswer (/src/pages/api/generateVideo.ts):**
  Função Serverless responsável por enviar uma requisição para a API do charGpt e retornar uma string com o conteúdo gerado pelo prompt inserido.

- **fetchAudioUrl (/src/pages/api/polly.ts.ts):**
  Função Serverless responsável por enviar uma string para o serviço Polly, da amazon AWS, e retornar uma URL para um arquivo no formato .mp3 contendo o áudio desta string sendo narrada.

- **generateVideo (/src/pages/api/polly.ts.ts):**
  Função Serverless responsável por recever as urls das imagens e do .mp3 da narração e utilizar as funções da biblioteca ffmpeg para gerar um vídeo. Este vídeo é salvo localmente e então enviado para um bucket s3 da Amazon. O link do vídeo neste bucket é disponibilizado para o usuário.
