'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Track visitor on page load
    async function trackVisitor() {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Silently fail - visitor tracking is optional
        console.debug('Visitor tracking failed:', error);
      }
    }

    // Track immediately on component mount
    trackVisitor();
  }, []);

  // This component doesn't render anything visible
  return null;
}