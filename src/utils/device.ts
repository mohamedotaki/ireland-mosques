export const isIOS = (): boolean => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};

export const isInStandaloneMode = (): boolean => {
    return 'standalone' in window.navigator && (window.navigator as any).standalone;
};
