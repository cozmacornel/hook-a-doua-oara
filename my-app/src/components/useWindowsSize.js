import {useState, useEffect} from 'react';
import './useWindowsSize.css';

function useWindowsSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;
    const isDesktop = size.width >= 1024;

    return { ...size, isMobile, isTablet, isDesktop };
}

export default useWindowsSize;
