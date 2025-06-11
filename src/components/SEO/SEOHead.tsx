import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Writers' Haven - A Community of Passionate Writers",
  description = "A community-driven platform where writers share their stories, insights, and creative works with readers around the world.",
  image = "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
  url = window.location.href,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  siteName = "Writers' Haven"
}) => {
  const fullTitle = title.includes("Writers' Haven") ? title : `${title} | Writers' Haven`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author || siteName} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Article specific tags */}
      {type === 'article' && author && (
        <meta property="article:author\" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time\" content={modifiedTime} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:site" content="@writershaven" />
      <meta name="twitter:creator" content={author ? `@${author.replace(/\s+/g, '').toLowerCase()}` : "@writershaven"} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data for Articles */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
              "@type": "Person",
              "name": author || "Anonymous"
            },
            "publisher": {
              "@type": "Organization",
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1"
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;