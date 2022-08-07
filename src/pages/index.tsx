import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css';
import Principal from './Principal'


const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Plataforma de compra de tokens</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Principal />
      </main>
      <footer className={styles.footer}>
           Desenvolvido por Sávio Cruz
 
      </footer>
      
    </div>
  )
}

export default Home
