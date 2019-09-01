import Menu from './Menu'

import { ReactNode } from 'react'

export interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => {
  return <div>
    <Menu />
    {children}
  </div>
}