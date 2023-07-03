/* eslint-disable */

import React from 'react';

import { Button } from '@mui/material';

const DownloadButton = ({ url, filename }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      sx={{
        backgroundColor: 'white',
        height: '80px',
        width: '300px',
        fontSize: '15px',
        color: 'red',
      }}
    >
      BAIXAR VÍDEO
    </Button>
  );
};

export default DownloadButton;
