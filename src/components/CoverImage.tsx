import Image from 'next/image';

function canOptimize(src: string) {
  return (
    src.startsWith('/') ||
    src.includes('images.unsplash.com') ||
    src.includes('.supabase.co')
  );
}

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function CoverImage({ src, alt, className, sizes, priority }: CoverImageProps) {
  if (!canOptimize(src)) {
    // Hosts outside next.config remotePatterns cannot go through the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
      className={className}
      priority={priority}
    />
  );
}
