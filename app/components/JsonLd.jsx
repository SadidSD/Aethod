/**
 * Reusable Server Component for embedding Schema.org JSON-LD structured data.
 * Sanitizes input to prevent XSS according to official Next.js recommendations.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
