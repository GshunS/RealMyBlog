// Resizer.js
import './Resizer.css';
import { useRef, useCallback } from 'react';
import { useSelector } from 'react-redux'


const Resizer = () => {
    const resizerRef = useRef(null);
    const {
        canRender,
    } = useSelector(state => state.blogContentNavbar)

    const getNavbarWidth = () => document.getElementsByClassName('nav-bar')[0].getBoundingClientRect().width;

    const handleMouseDown = useCallback((e) => {
        const startPos = { x: e.clientX };
        const currentLeftWidth = getNavbarWidth();

        const handleMouseMove = (e) => {
            const dx = e.clientX - startPos.x;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleTouchStart = useCallback((e) => {
        const startPos = { x: e.touches[0].clientX };
        const currentLeftWidth = getNavbarWidth();

        const handleTouchMove = (e) => {
            const dx = e.touches[0].clientX - startPos.x;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, []);

    const updateWidth = (currentLeftWidth, dx) => {
        const navbar = document.getElementsByClassName('nav-bar')[0];
        const mainContent = document.getElementsByClassName('main-content')[0];
        const container = document.getElementsByClassName('body-container')[0];

        const containerWidth = container.getBoundingClientRect().width;
        const newNavBarWidth = ((currentLeftWidth + dx) * 100) / containerWidth;

        navbar.style.width = `${Math.max(25, Math.min(newNavBarWidth, 70))}%`;
        mainContent.style.width = `${98 - Math.max(25, Math.min(newNavBarWidth, 70))}%`;
    };

    const updateCursor = () => {
        const resizerEle = resizerRef.current;
        const navbar = document.getElementsByClassName('nav-bar')[0];
        const mainContent = document.getElementsByClassName('main-content')[0];

        if (!navbar || !resizerEle || !mainContent) return;

        resizerEle.style.cursor = 'ew-resize';
        document.body.style.cursor = 'ew-resize';
        navbar.style.userSelect = 'none';
        navbar.style.pointerEvents = 'none';
        mainContent.style.userSelect = 'none';
        mainContent.style.pointerEvents = 'none';
    };

    const resetCursor = () => {
        const resizerEle = resizerRef.current;
        const navbar = document.getElementsByClassName('nav-bar')[0];
        const mainContent = document.getElementsByClassName('main-content')[0];

        if (!navbar || !resizerEle || !mainContent) return;

        resizerEle.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        navbar.style.removeProperty('user-select');
        navbar.style.removeProperty('pointer-events');
        mainContent.style.removeProperty('user-select');
        mainContent.style.removeProperty('pointer-events');
    };

    if (!canRender) return <div></div>;
    return (
        <div
            className="resizer"
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        />
    );
};

export default Resizer;
