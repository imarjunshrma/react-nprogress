import { useRef, useState, useEffect } from "react";
import nProgress from './nprogress';
import './nprogress.css';

const basicConfiguration = {
    minimum: 0.08,
    easing: 'linear',
    positionUsing: '',
    speed: 200,
    trickle: false,
    trickleSpeed: 200,
    showSpinner: false,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
}
const NProgress = ({ configure, options = { onRouteChange: true, onSectionScroll: false }, delayMs = 600, steps = 9 }) => {
    let { onRouteChange, onSectionScroll } = options;
    const [timer, setTimer] = useState();
    const prev = useRef(0);
    const ref = useRef();

    // const propConfigure =
    function scrollShow() {
        const scroll = window.scrollY; //scroll from Y
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (steps > 9) {
            steps = steps % 9;
        } //steps can't be greater than 10
        let minHeight = totalHeight / steps;
        if (prev.current !== Math.ceil(scroll / minHeight)) {
            let x = Math.ceil(scroll / minHeight);
            if (prev.current === 0) {
                //on first time when we refresh page
                nProgress.set(0.1 * x);
            }
            if (x < steps && x <= 9) { //x<9 because 0.1*10=1 
                nProgress.set(0.1 * x);
            }
            if (totalHeight - scroll < minHeight && x >= steps) {
                nProgress.set(0.98)
            }
            prev.current = Math.ceil(scroll / minHeight)
        }
    }
    const runOnRouteChange = () => {
        let interval;
        if (delayMs > 100) {
            let time = Math.trunc(delayMs / 100);
            let count = 1;
            interval = setInterval(() => {
                nProgress.set(0.1 * count);
                if (count < steps) {
                    count++;
                } else {
                    clearInterval(interval);
                    nProgress.done(true);
                }
            }, time)
        } else {
            let time = setTimeout(() => {
                nProgress.done(true);
            }, delayMs)
            setTimer(time);
        }
    }
    //on routechage ->true
    const watchClick = () => {
        if (ref.current === window.location.pathname) return;
        if (timer) {
            clearTimeout(timer);
        }
        ref.current = window.location.pathname;
        nProgress.start();
        runOnRouteChange();
    }
    const firstTimeRun = () => {
        ref.current = window.location.pathname;
        clearTimeout(timer);
        runOnRouteChange();
    }
    useEffect(() => {
        if (configure) {
            let newConfigure = {};
            Object.keys(configure).forEach(val => {
                if (val !== "speed" && val !== "trickleSpeed" && val !== "trickle")
                    newConfigure[val] = configure[val];
            })
            nProgress.configure({ ...basicConfiguration, ...newConfigure });
        } else {
            nProgress.configure({ ...basicConfiguration })
        }
        if (onSectionScroll) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            onRouteChange = false;
        } else if (onRouteChange) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            onSectionScroll = false;
        }
        if (onSectionScroll && !onRouteChange) {
            nProgress.set(0.0)
            prev.current = 0;
            scrollShow();
            window.addEventListener("scroll", scrollShow);
        }
        if (!onSectionScroll && onRouteChange) {
            firstTimeRun();
            window.addEventListener("click", watchClick)
        }
        // ref.current = window.location.pathname;
        return () => {
            if (onSectionScroll) {
                window.removeEventListener("scroll", scrollShow);
            }
            if (timer) {
                clearTimeout(timer);
            }

            if (onRouteChange) {
                nProgress.remove();
            }
        }
    }, [configure, options, delayMs])

    return;
}

// const NProgress = memo(NProgressC);
export default NProgress;