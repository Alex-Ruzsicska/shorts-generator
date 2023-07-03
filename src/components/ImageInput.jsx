/* eslint-disable */

import React from 'react';

// import styles from '../../s';

const ImageInput = ({ onChange }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onChange(files);
  };

  return (
    <input
      type='file'
      accept='image/*'
      // multiple
      onChange={handleFileChange}
      style={{
        // backgroundColor: 'white',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '',
      }}
    />
  );
};

export default ImageInput;
