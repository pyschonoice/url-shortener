import { useState } from 'react';
import { createShortUrl, getClickCount } from '../services/api';

export default function useShortener(initialExpiry = 24) {
  const [url, setUrl]             = useState('');
  const [shortUrl, setShortUrl]   = useState('');
  const [clicks, setClicks]       = useState(null);

  const [advOpen, setAdvOpen]     = useState(false);
  const [expiresIn, setExpiresIn] = useState(initialExpiry);
  const [clicksOpen, setClicksOpen] = useState(false);

  const formatExpiry = h => {
    const hrs  = Number(h);
    const days = Math.floor(hrs / 24);
    const rem  = hrs % 24;
    return `${days > 0 ? days + 'd ' : ''}${rem > 0 ? rem + 'h' : ''}`.trim() || '0h';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!url) return;
    const su = await createShortUrl(url.trim(), Number(expiresIn));
    setShortUrl(su);
    setClicks(null);
    setClicksOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  const fetchClicks = async () => {
    const count = await getClickCount(shortUrl);
    setClicks(count);
  };

  const toggleAdv    = () => setAdvOpen(o => !o);
  const toggleClicks = async () => {
    const now = !clicksOpen;
    setClicksOpen(now);
    if (now) await fetchClicks();
  };

  return {
    url, setUrl,
    shortUrl, clicks,
    advOpen, expiresIn,
    clicksOpen,
    formatExpiry,
    handleSubmit,
    handleCopy,
    fetchClicks,
    toggleAdv,
    toggleClicks,
    setExpiresIn
  };
}
