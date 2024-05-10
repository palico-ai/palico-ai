'use client'

import React from 'react'
import { Dropzone, DropzoneProps, FileMosaic } from '@dropzone-ui/react';

export const FileUpload: React.FC<DropzoneProps> = ({
  value = [],
  ...rest
}) => {
  return (
    <Dropzone value={value} {...rest}>
      {value.map((file) => (
        <FileMosaic key={file.name} {...file} preview />
      ))}
    </Dropzone>
  )
}

