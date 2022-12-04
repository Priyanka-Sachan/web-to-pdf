export default function WebContent(props) {
  const { title, htmlContent, textContent } = props.content
  return (
    <>
      <h1>{title}</h1>
      <div
        className="prose prose:slate"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
    </>
  )
}
