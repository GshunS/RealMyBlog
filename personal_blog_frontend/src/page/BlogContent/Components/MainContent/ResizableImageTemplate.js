import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TipTapImage from "@tiptap/extension-image";

// Custom useEvent hook to manage stable event handlers
const useEvent = (handler) => {
    const handlerRef = useRef(null);

    useLayoutEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    return useCallback((...args) => {
        if (!handlerRef.current) {
            throw new Error("Handler is not assigned");
        }
        return handlerRef.current(...args);
    }, []);
};

const MIN_WIDTH = 60;
const BORDER_COLOR = "#0096fd";

const ResizableImageTemplate = ({ node, updateAttributes }) => {
    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const [resizingStyle, setResizingStyle] = useState(undefined);

    // Detect clicks outside the container to disable editing mode
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setEditing(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [editing]);

    const handleMouseDown = useEvent((event) => {
        if (!imgRef.current) return;
        event.preventDefault();

        const direction = event.currentTarget.dataset.direction || "--";
        const initialXPosition = event.clientX;
        const currentWidth = imgRef.current.width;
        let newWidth = currentWidth;
        const transform = direction[1] === "w" ? -1 : 1;

        const removeListeners = () => {
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseup", removeListeners);
            updateAttributes({ width: newWidth });
            setResizingStyle(undefined);
        };

        const mouseMoveHandler = (event) => {
            newWidth = Math.max(currentWidth + transform * (event.clientX - initialXPosition), MIN_WIDTH);
            setResizingStyle({ width: newWidth });

            if (!event.buttons) removeListeners();
        };

        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", removeListeners);
    });

    const dragCornerButton = (direction) => (
        <div
            role="button"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            data-direction={direction}
            style={{
                position: "absolute",
                height: "5px",
                width: "5px",
                backgroundColor: BORDER_COLOR,
                ...({ n: { top: 0 }, s: { bottom: 0 } }[direction[0]]),
                ...({ w: { left: 0 }, e: { right: 0 } }[direction[1]]),
                cursor: `${direction}-resize`,
            }}
        />
    );

    return (
        <NodeViewWrapper
            ref={containerRef}
            as="div"
            draggable
            data-drag-handle
            onClick={() => setEditing(true)}
            onBlur={() => setEditing(false)}
        >
            <div
                style={{
                    overflow: "hidden",
                    position: "relative",
                    display: "inline-block",
                    lineHeight: "0px",
                }}
            >
                <img
                    {...node.attrs}
                    ref={imgRef}
                    style={{
                        ...resizingStyle,
                        cursor: "default",
                    }}
                />
                {editing && (
                    <>
                        {[
                            { left: 0, top: 0, height: "100%", width: "1px" },
                            { right: 0, top: 0, height: "100%", width: "1px" },
                            { top: 0, left: 0, width: "100%", height: "1px" },
                            { bottom: 0, left: 0, width: "100%", height: "1px" },
                        ].map((style, i) => (
                            <div key={i} style={{ position: "absolute", backgroundColor: BORDER_COLOR, ...style }} />
                        ))}
                        {dragCornerButton("nw")}
                        {dragCornerButton("ne")}
                        {dragCornerButton("sw")}
                        {dragCornerButton("se")}
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
};

export default TipTapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: { renderHTML: ({ width }) => ({ width }) },
            height: { renderHTML: ({ height }) => ({ height }) },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageTemplate);
    },
}).configure({ inline: true });
