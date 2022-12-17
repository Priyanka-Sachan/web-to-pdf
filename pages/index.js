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
  const pdfEmbed = useRef(null)
  const [urlContent, setUrlContent] = useState({})

  async function getURLContent(e) {
    e.preventDefault()
    const url = urlInput.current.value
    console.log(`URL: ${url}`)
    // Fetch URL Content
    const response = await fetch('/api/content/webpage?url=' + url, {
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

    // Converting images to base64 encoding
    const images = htmlContent.querySelectorAll('img')
    for (const i of images) {
      if (i.src.substring(0, 5) != 'data:') {
        const response = await fetch('/api/content/image?url=' + i.src, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          i.src = data.base64
          i.removeAttribute('srcset')
        } else {
          console.log(response)
          i.remove()
        }
      }
    }

    console.log(htmlContent)
    // Convert HTML to pdfmake format
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
    // Convert to PDF
    var docDefinition = {
      content: ret.content,
      images: ret.images,
      styles: {
        pre: {
          background: 'whitesmoke', // it will add a yellow background to all <STRONG> elements
        },
      },
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)

    pdfDocGenerator.getDataUrl((dataUrl) => {
      pdfEmbed.current.src = dataUrl + '#zoom=FitH'
    })
  }

  return (
    <div>
      <Head>
        <title>WEB to PDF</title>
        <meta name="description" content="Convert webpages to PDFs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto prose prose:slate max-w-full pl-16 pr-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 mt-16">
          <div ref={webContent}>
            <WebContent content={urlContent} />
          </div>
          <embed
            ref={pdfEmbed}
            src=""
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            width="100%"
            height="100%"
          ></embed>
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
