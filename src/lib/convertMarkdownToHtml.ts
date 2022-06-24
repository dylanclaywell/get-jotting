import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export default function convertMarkdownToHtml(markdown: string) {
  const html = marked(markdown)
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
    ],
  })
}
