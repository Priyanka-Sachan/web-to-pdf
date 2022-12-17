import Readability from '../Readability'
const jsdom = require('jsdom')
const { JSDOM } = jsdom
import fetch from 'node-fetch'

export default async function getWebpageContent(req, res) {
  if (req.method == 'GET') {
    const query = req.query
    try {
      const url = query.url
      await fetch(url)
        .then((response) => response.text())
        .then(async (data) => {
          const doc = new JSDOM(data)
          const document = doc.window.document

          // For code
          document.querySelectorAll('pre').forEach((p) => {
            var newPre = document.createElement('div')
            const items = p.textContent
              .trim()
              .split(/\n/)
              .map((el) => {
                if (el.trim() != '') {
                  console.log(el)
                  newPre.textContent = el
                  return newPre.outerHTML
                }
              })
              .join('\n')
            var newNode = document.createElement('div')
            newNode.classList.add('pre')
            newNode.innerHTML = items
            p.parentNode.replaceChild(newNode, p)
          })

          // For images
          const images = document.querySelectorAll('img')
          for (const i of images) {
            let newSrc = new URL(i.getAttribute('src'), url).href
            if (newSrc.includes('?'))
              newSrc = newSrc.slice(0, newSrc.indexOf('?'))
              i.src = newSrc
              i.removeAttribute('srcset')
          }

          // Parsing
          const docClone = document.cloneNode(true)
          const article = new Readability(docClone).parse()
          console.log('Parsed..')
          console.log(article)
          const parsedArticle = {
            title: article.title,
            htmlContent: article.content,
            textContent: article.textContent,
          }
          res.status(201).json(parsedArticle)
        })
    } catch (e) {
      console.log(e)
      res.status(400).json({ error: e })
    }
  }
}
