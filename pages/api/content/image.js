import fetch from 'node-fetch'

export default async function getImageContent(req, res) {
  if (req.method == 'GET') {
    const query = req.query
    try {
      const url = query.url
      const imageUrlData = await fetch(url)
      const contentType = imageUrlData.headers.get('content-type')
      if (
        contentType == 'image/png' ||
        contentType == 'image/jpeg' ||
        contentType == 'image/jpg'
      ) {
        const buffer = await imageUrlData.arrayBuffer()
        const stringifiedBuffer = Buffer.from(buffer).toString('base64')
        const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`
        res.status(201).json({ url: url, base64: imageBase64 })
      } else {
        throw { message: 'Invalid content type' }
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({ error: e })
    }
  }
}
