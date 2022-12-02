import Head from 'next/head'
import { useRef, useState } from 'react'
import WebContent from '../components/WebContent'

export default function Home() {
  const urlInput = useRef('')
  const [urlContent, setUrlContent] = useState('')

  async function getURLContent(e) {
    e.preventDefault()
    const url = urlInput.current.value
    console.log(`URL: ${url}`)
    // Fetch URL Content
    const response = await fetch('/api/url-content?url=' + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    try {
      const data = await response.json()
      setUrlContent(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <Head>
        <title>WEB to PDF</title>
        <meta name="description" content="Convert webpages to PDFs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto prose prose:slate">
        <h1>WEB to PDF</h1>
        <form>
          <label
            for="url"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            URL
          </label>
          <div className="relative">
            <input
              type="search"
              id="url"
              ref={urlInput}
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://anything.io"
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={getURLContent}
            >
              Get
            </button>
          </div>
        </form>
        <WebContent content={urlContent} />
      </div>
    </div>
  )
}
