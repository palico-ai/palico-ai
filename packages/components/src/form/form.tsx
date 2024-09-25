import React from 'react';
import { PropsOf } from '@emotion/react';

export const Form: React.FC<PropsOf<'form'>> = ({ onSubmit, ...rest }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return <form onSubmit={handleSubmit} {...rest} />;
};
