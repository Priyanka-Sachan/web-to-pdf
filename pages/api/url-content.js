export default async function getURLContent(req, res) {
  if (req.method == 'GET') {
    const query = req.query
    try {
      const url = query.url
      var urlContent=''
      await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          //...parse the document and populate
          urlContent=data
        })
      res.status(201).json({ message: urlContent })
    } catch (e) {
      console.log(e)
    }
  }
}
