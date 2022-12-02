import Readability from './Readability'
const jsdom = require('jsdom')
const { JSDOM } = jsdom

export default async function getURLContent(req, res) {
  if (req.method == 'GET') {
    const query = req.query
    try {
      const url = query.url
      await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const doc = new JSDOM(data)
          const docClone = doc.window.document
          const article = new Readability(docClone).parse()
          const parsedArticle = {
            title: article.title,
            htmlContent: article.content,
            textContent: article.textContent,
          }
          res.status(201).json(parsedArticle)
        })
    } catch (e) {
      console.log(e)
      res.status(400).json({error:e})
    }
  }
}
