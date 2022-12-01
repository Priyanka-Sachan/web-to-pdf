import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>WEB to PDF</title>
        <meta name="description" content="Convert webpages to PDFs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto prose prose:slate">
        <h1>Welcome!</h1>
      </div>
    </div>
  )
}
