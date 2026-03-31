import { useEffect, useRef } from 'react';

interface AdPlaceholderProps {
  type: 'banner' | 'sidebar' | 'footer';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (scriptInjected.current || !adContainerRef.current) return;

    // Only inject for footer as requested (bottom of the website)
    if (type === 'footer') {
      const container = adContainerRef.current;
      
      // @ts-ignore
      window.atOptions = {
        'key' : '4f6fd1f0acd9796b4c47c9c4972bf5e8',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/4f6fd1f0acd9796b4c47c9c4972bf5e8/invoke.js';
      script.async = true;
      
      container.appendChild(script);
      scriptInjected.current = true;
    }
  }, [type]);

  const styles = {
    banner: "w-full h-24 md:h-32 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm my-8",
    sidebar: "w-full h-64 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm",
    footer: "w-full min-h-[90px] flex items-center justify-center mt-12"
  };

  return (
    <div className={styles[type]} ref={adContainerRef}>
      {type !== 'footer' && (
        <div className="text-center">
          <p className="font-bold">Adsterra Ad Placement</p>
          <p className="text-xs italic">Place your script here</p>
        </div>
      )}
    </div>
  );
}
