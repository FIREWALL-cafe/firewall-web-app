import { useEffect, useState } from 'react';
import { getCensorshipSettings } from '../lib/sanity';

// Editor-managed additions to the built-in state-media domain list, fetched
// once per page load and shared by every component instance.
let cachedFetch = null;

export function useStateMediaDomains() {
  const [extraDomains, setExtraDomains] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (!cachedFetch) {
      cachedFetch = getCensorshipSettings().catch(() => ({}));
    }
    cachedFetch.then((settings) => {
      if (!mounted) return;
      const domains = (settings?.stateMediaDomains || [])
        .filter((d) => typeof d === 'string' && d.trim())
        .map((d) => d.trim().toLowerCase());
      if (domains.length) setExtraDomains(domains);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return extraDomains;
}

// Test-only: clear the page-load cache so each test controls the settings mock.
export function __resetStateMediaDomainsCache() {
  cachedFetch = null;
}
