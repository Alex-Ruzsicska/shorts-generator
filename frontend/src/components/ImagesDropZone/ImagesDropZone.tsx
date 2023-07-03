import { File } from 'buffer';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '100px' }} />
    </li>
  ));

  useEffect(() => {
    onChange(acceptedFiles);
  }, [acceptedFiles, onChange]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop some files here, or click to select files</p>
      <ul>{files}</ul>
    </div>
  );
};

export default ImageDropzone;
