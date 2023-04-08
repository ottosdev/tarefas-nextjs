import { HTMLProps } from "react";


export default function TextArea({...rest}: HTMLProps<HTMLTextAreaElement>) {
  return (
    <textarea
    style={{
      width: '100%',
      resize: 'none',
      height: 160,
      borderRadius: 8,
      outline: 'none',
      padding: 8
    }}
    {...rest}></textarea>
  )
}
