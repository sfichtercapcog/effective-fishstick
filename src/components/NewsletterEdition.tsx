import React from 'react';

interface NewsletterEditionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const NewsletterEdition: React.FC<NewsletterEditionProps> = ({ id, title, children }) => {
  return (
    <div className="blog-post active" id={id}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default NewsletterEdition;