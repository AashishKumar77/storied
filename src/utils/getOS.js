export const getOS=()=> {
    var userAgent = window.navigator.userAgent,
        os = null;
  
    if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
      os = 'mac';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      os = 'iOS';
    } else if (/Win32|windows|Win64|WinCE/i.test(userAgent)) {
      os = 'windows';
    } else if (/android/i.test(userAgent)) {
      os = 'android';
    } else if (!os && /linux/i.test(userAgent)) {
      os = 'linux';
    }
    return os;
  }
