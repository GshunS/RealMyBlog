import React, { useEffect, useRef } from "react";
import "./TableContextMenu.css";

const TableContextMenu = ({ editor, position, onClose }) => {
    const menuRef = useRef(null);

    const handleMenuClick = (command) => {
        command();
        onClose();
    };

    useEffect(() => {
        const menuElement = menuRef.current;
        const editorContainer = editor.view.dom;

        if (menuElement && editorContainer) {
            requestAnimationFrame(() => {
                menuElement.classList.add("visible");

                const menuWidth = menuElement.offsetWidth;
                const menuHeight = menuElement.offsetHeight;

                const editorRect = editorContainer.getBoundingClientRect();
                const { left: editorLeft, top: editorTop, width: editorWidth, height: editorHeight } = editorRect;

                let { x, y } = position;
                x = x - editorLeft + 100;

                const maxRight = editorWidth;
                const maxBottom = editorHeight;

                if (x + menuWidth > maxRight) {
                    x = maxRight - menuWidth - 150;
                }

                if (y + menuHeight > maxBottom) {
                    y = maxBottom - menuHeight - 10;
                }
                console.log(y)

                x = Math.max(x, 36);
                y = Math.max(y, 100);

                menuElement.style.left = `${x}px`;
                menuElement.style.top = `${y}px`;
            });
        }

        const handleClickOutside = (event) => {
            if (menuElement && !menuElement.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editor, onClose, position]);

    return (
        <div ref={menuRef} className="context-menu">
            <ul>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().addColumnBefore().run())}>
                    Add Column (Before)
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().addColumnAfter().run())}>
                    Add Column (After)
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().addRowBefore().run())}>
                    Add Row (Above)
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().addRowAfter().run())}>
                    Add Row (Below)
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().toggleHeaderColumn().run())}>
                    Toggle header column
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().toggleHeaderRow().run())}>
                    Toggle header row
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().mergeCells().run())}>
                    Merge or split
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().deleteColumn().run())}>
                    Delete Column
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().deleteRow().run())}>
                    Delete Row
                </li>
                <li onClick={() => handleMenuClick(() => editor.chain().focus().deleteTable().run())}>
                    Delete Table
                </li>
            </ul>
        </div>

    );
};

export default TableContextMenu;
