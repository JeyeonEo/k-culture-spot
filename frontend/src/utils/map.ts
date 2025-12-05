import type { MapProvider } from '../types';

export function getMapProvider(): MapProvider {
  return (localStorage.getItem('mapProvider') as MapProvider) || 'google';
}

export function openMap(latitude: number, longitude: number, name?: string): void {
  const provider = getMapProvider();
  let url: string;

  if (provider === 'naver') {
    // Naver Maps URL format
    // For mobile, it will try to open the app first
    const placeName = name ? encodeURIComponent(name) : '';
    url = `nmap://place?lat=${latitude}&lng=${longitude}&name=${placeName}&appname=com.kculture.spot`;

    // Fallback to web version if app is not installed
    window.location.href = url;
    setTimeout(() => {
      window.open(`https://map.naver.com/p/search/${placeName}?c=${longitude},${latitude},15,0,0,0,dh`, '_blank');
    }, 500);
  } else {
    // Google Maps URL format
    // This works for both web and mobile (opens app if installed)
    const query = name ? encodeURIComponent(name) : `${latitude},${longitude}`;
    url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  }
}

export function getMapUrl(latitude: number, longitude: number, name?: string): string {
  const provider = getMapProvider();

  if (provider === 'naver') {
    const placeName = name ? encodeURIComponent(name) : '';
    return `nmap://place?lat=${latitude}&lng=${longitude}&name=${placeName}&appname=com.kculture.spot`;
  } else {
    const query = name ? encodeURIComponent(name) : `${latitude},${longitude}`;
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
}
