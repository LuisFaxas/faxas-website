'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/portal/dashboard');
  }, [router]);
  
  return null;
}