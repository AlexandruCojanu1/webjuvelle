'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface BlogPostScriptsProps {
  scripts: string;
}

export default function BlogPostScripts({ scripts }: BlogPostScriptsProps) {
  useEffect(() => {
    if (scripts && typeof window !== 'undefined') {
      // Execute scripts after Chart.js is loaded
      const executeScripts = () => {
        try {
          // Use Function constructor to execute scripts in global scope
          // This allows Chart.js to be available
          const scriptFunction = new Function(scripts);
          scriptFunction();
        } catch (error) {
          console.error('Error executing blog post scripts:', error);
        }
      };

      // Wait for Chart.js to be available
      if (typeof window !== 'undefined' && (window as any).Chart) {
        executeScripts();
      } else {
        // Wait for Chart.js to load
        const checkChart = setInterval(() => {
          if ((window as any).Chart) {
            clearInterval(checkChart);
            executeScripts();
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkChart);
        }, 5000);
      }
    }
  }, [scripts]);

  return (
    <>
      {/* Load Chart.js from CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Scripts will execute in useEffect after Chart.js loads
        }}
      />
    </>
  );
}

