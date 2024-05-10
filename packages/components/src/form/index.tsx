import { PropsOf } from '@emotion/react'

export * from './file_upload'
export * from './form_builder'
export * from './simple_dialog_form'
export * from './autocomplete'
export * from './textfield'

export const Form: React.FC<PropsOf<'form'>> = ({ onSubmit, ...rest }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (onSubmit) onSubmit(e)
  }

  return <form onSubmit={handleSubmit} {...rest}/>
}