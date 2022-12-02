export default function WebContent(props) {
  const { title, htmlContent, textContent } = props.content
  return <div>{textContent}</div>
}
