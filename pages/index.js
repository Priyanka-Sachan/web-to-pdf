import Head from 'next/head'
import { useRef, useState } from 'react'
import WebContent from '../components/WebContent'
import htmlToPdfmake from 'html-to-pdfmake'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

export default function Home() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  const webContent = useRef(null)
  const urlInput = useRef('')
  const [urlContent, setUrlContent] = useState({})

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
      console.log(data)
      setUrlContent(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function convertToPdf(e) {
    console.log(webContent.current)
    const htmlContent = webContent.current
    var ret = htmlToPdfmake(htmlContent.outerHTML, {
      defaultStyles: {
        // change the default styles
        img: {
          maxWidth: 500,
        },
      },
      imagesByReference: true,
    })
    console.log(ret)
    var docDefinition = {
      content: ret.content,
      images: ret.images,
      styles: {
        pre: {
          background: 'whitesmoke', // it will add a yellow background to all <STRONG> elements
        },
      },
    }
    pdfMake.createPdf(docDefinition).download()

    // Using js2pdf
    // doc.html(htmlContent, {
    //   callback: function (doc) {
    //     doc.save()
    //   },
    //   margin: [20, 20, 20, 20],
    //   autoPaging: 'text',
    //   filename: 'hello',
    //   x: 0,
    //   y: 0,
    //   width: 400, //target width in the PDF document
    //   windowWidth: 700, //window width in CSS pixels
    // })
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
            htmlFor="url"
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
        <div ref={webContent}>
          <WebContent content={urlContent} />
        </div>
        <button
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={convertToPdf}
        >
          Convert to pdf
        </button>
      </div>
    </div>
  )
}
