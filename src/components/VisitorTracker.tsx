'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string>('');

  useEffect(() => {
    // Avoid double tracking if the URL hasn't changed
    const currentUrl = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '');
    if (lastTracked.current === currentUrl) return;
    lastTracked.current = currentUrl;

    // Don't track admin pages or API requests
    if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next')) return;

    const trackView = async () => {
      try {
        let city = 'Desconhecida';
        let region = 'Desconhecido';
        let country = 'Desconhecido';

        try {
          // Fetch location using free geolocation API (limit 1500 per day or similar, very lightweight and free)
          const geoRes = await fetch('https://geolocation-db.com/json/');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city || 'Desconhecida';
            region = geoData.state || 'Desconhecido';
            country = geoData.country_name || 'Desconhecido';
          }
        } catch (err) {
          console.warn('Geolocation failed, falling back to defaults', err);
        }

        const referrer = document.referrer || 'Direto';
        const userAgent = navigator.userAgent;

        await supabase.from('page_views').insert([{
          url: pathname,
          referrer: referrer,
          user_agent: userAgent,
          city: city,
          region: region,
          country: country
        }]);
      } catch (err) {
        console.error('VisitorTracker error:', err);
      }
    };

    trackView();
  }, [pathname, searchParams]);

  return null;
}
