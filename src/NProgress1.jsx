import React from "react";
import nProgress from './nprogress.js';
import "./nprogress.css";

const NProgress = ({ configure, options = { onRouteChange: true, onSectionScroll: false } }) => {
    const { onRouteChange, onSectionScroll } = options;
    function scrollShow() {
        const scroll = window.scrollY; //scroll from Y
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let minHeight = Math.round(totalHeight / 9);
        if (Math.trunc(scroll / minHeight)) {
            let x = Math.trunc(scroll / minHeight);
            nProgress.set(0.1 * x);
            if (scroll > minHeight * 9) {
                nProgress.set(0.98);
            }
        }
    }
    React.useEffect(() => {
        if (configure) {
            nProgress.configure({ ...configure });
        }
        if (onSectionScroll) {
            nProgress.set(0.0);
            window.addEventListener("scroll", scrollShow);
        }
        if (onRouteChange) {
            nProgress.start()
            setTimeout(() => {
                nProgress.done(true);
            }, 500)
        }
        return () => {
            if (onSectionScroll) {
                window.removeEventListener("scroll", scrollShow);
            }
            if (onRouteChange) {
                nProgress.done(true);
            }
        }
    }, [])
    return null;
}

export default NProgress;