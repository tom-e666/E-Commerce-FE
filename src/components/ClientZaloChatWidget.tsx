'use client';

import dynamic from 'next/dynamic';

const ZaloChatWidget = dynamic(() => import('./ZaloChatWidget'), {
  ssr: false,
  loading: () => null
});

export default function ClientZaloChatWidget() {
  return <ZaloChatWidget />;
}
