import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

/**
 * Renders a GitHub README (raw markdown) into safe, styled HTML.
 * Relative image/link URLs are resolved against the repo's raw content
 * base so screenshots embedded in the README actually load.
 */
export default function Readme({
  markdown,
  fullName,
  branch,
}: {
  markdown: string;
  fullName: string;
  branch: string;
}) {
  const rawBase = `https://raw.githubusercontent.com/${fullName}/${branch}/`;

  const resolveUrl = (url?: string) => {
    if (!url) return url ?? '';
    if (/^(https?:|mailto:|#|data:|\/\/)/i.test(url)) {
      // Convert GitHub "blob" links to raw so inline images render.
      return url.replace(
        /https?:\/\/github\.com\/(.+?)\/blob\/(.+)/i,
        'https://raw.githubusercontent.com/$1/$2'
      );
    }
    return rawBase + url.replace(/^\.?\//, '');
  };

  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-line prose-pre:border prose-pre:border-line prose-pre:bg-surface prose-code:text-neon prose-code:before:content-none prose-code:after:content-none prose-hr:border-line">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        urlTransform={resolveUrl}
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noreferrer" {...props} />
          ),
          img: ({ node, ...props }) => <img loading="lazy" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
