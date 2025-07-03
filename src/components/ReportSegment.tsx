import Image from 'next/image';
import { ReactNode } from 'react';

interface ReportSegmentProps {
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  caption?: string;
  children: ReactNode;
}

export default function ReportSegment({ title, image, caption, children }: ReportSegmentProps) {
  return (
    <div className="report-segment">
      <h3>{title}</h3>
      {image && (
        <figure>
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={400}
            layout="responsive"
            priority={false}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )}
      {children}
    </div>
  );
}