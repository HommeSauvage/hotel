import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
import Global from './Global'
import Layout from './Layout'

export interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

const Page = ({ title, description, children, ...props }: Props) => {
  return (
    <Global>
      <Head>
        <title>{title || 'Hotel'}</title>

        <link key={'toastify'} rel="stylesheet" href="/static/css/ReactToastify.min.css" />
        
        {description && <meta
          name="description"
          content={description} />}
      </Head>

      <Layout {...props}>
        {children}
      </Layout>
      
      <ToastContainer />
    </Global>
  )
}

export default Page
