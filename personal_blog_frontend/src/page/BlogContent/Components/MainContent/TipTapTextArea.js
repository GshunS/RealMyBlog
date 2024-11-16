import React, { useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faListUl, faListOl, faBold, faItalic, faStrikethrough, faLink, faMinus, faHeading, faTable } from '@fortawesome/free-solid-svg-icons';

// import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import FileHandler from '@tiptap-pro/extension-file-handler'
import ResizableImageExtension from './TipTapCustomExtensions/ResizableImageTemplate';
import IndentHandler from './TipTapCustomExtensions/IndentHandler';
import ImageClipboardHandler from './TipTapCustomExtensions/ImageClipboardHandler';
import TableContextMenu from './TableContextMenu';

import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Dropcursor from '@tiptap/extension-dropcursor'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskItem from '@tiptap/extension-task-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TaskList from '@tiptap/extension-task-list'
import Gapcursor from '@tiptap/extension-gapcursor'
import Strike from '@tiptap/extension-strike'
import csharp from 'highlight.js/lib/languages/csharp'
import { createLowlight } from 'lowlight'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import History from '@tiptap/extension-history'

import { fetchData } from '../../../../utils/apiService'
import { useDispatch, useSelector } from 'react-redux'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editArticleSaveStatus, editArticleInfo } from '../../../../store/modules/blogContentMainContentStore'

import './TipTapTextArea.css'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import _ from 'lodash'

const TiptapTextArea = () => {
    const [contextMenu, setContextMenu] = useState(null);
    const { tokenValid } = useSelector(state => state.blogContentLogin);

    const lowlight = createLowlight();
    lowlight.register({ csharp })
    const {
        articleInfo
    } = useSelector(state => state.blogContentMainContent)


    const dispatch = useDispatch();
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            HorizontalRule,
            Text,
            Strike,
            Dropcursor,
            Gapcursor,
            Heading,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            BulletList, OrderedList, ListItem,
            ResizableImageExtension,
            IndentHandler,
            ImageClipboardHandler,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(file => {
                        const fileReader = new FileReader()

                        fileReader.readAsDataURL(file)
                        fileReader.onload = () => {
                            currentEditor.chain().insertContentAt(pos, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result,
                                    width: 200,
                                    height: 200
                                },
                            }).focus().run()
                        }
                    })
                },
            }),
            Bold,
            Italic,
            History.configure({
                newGroupDelay: 100,
            }),
        ],
        editorProps: {
            handleDOMEvents: {
                contextmenu: (view, event) => {
                    const target = event.target;
                    if (target.closest("td") || target.closest("th")) {
                        event.preventDefault();
                        const { clientX: x, clientY: y } = event;
                        setContextMenu({ x, y });
                        return true;
                    }
                    return false;
                },
            },
        },
        content: '',

        // editable: false,
        onUpdate: ({ editor }) => {
            if (!editor.isEditable) {
                return;
            }

            const { from } = editor.view.state.selection;
            const startDOM = editor.view.domAtPos(from).node;
            if (startDOM && startDOM instanceof HTMLElement) {
                startDOM.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }

            dispatch(editArticleSaveStatus('unsave'));
            handleSubmit();
        },
        onPaste(event) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;

            let imagePasted = false;

            for (const item of items) {
                if (item.type.indexOf("image") === 0) {
                    const file = item.getAsFile();
                    const fileReader = new FileReader();

                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        editor.chain().insertContentAt(editor.state.selection.anchor, {
                            type: 'image',
                            attrs: {
                                src: fileReader.result,
                                width: 200,
                                height: 200
                            },
                        }).focus().run()
                    }
                    event.preventDefault();
                    imagePasted = true;
                }
            }

            if (!imagePasted) {
                const htmlData = event.clipboardData.getData("text/html");
                if (htmlData.includes("<img")) {
                    event.preventDefault();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlData, "text/html");
                    const img = doc.querySelector("img");

                    if (img) {
                        editor.chain().focus().setImage({ src: img.src, width: 200, height: 200 }).run();
                    }
                }
            }
        }

    });

    useEffect(() => {
        editor.setEditable(tokenValid)
    }, [dispatch, editor, tokenValid]);

    useEffect(() => {
        if (editor && articleInfo.articleId) {
            editor.commands.setContent(JSON.parse(articleInfo.articleJsonContent));
            // editor.commands.focus(cursorPos);
        }
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, articleInfo.articleId])



    function getExtensionFromDataURL(dataURL) {
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        switch (mimeType) {
            case 'image/jpeg':
                return 'jpg';
            case 'image/png':
                return 'png';
            case 'image/gif':
                return 'gif';
            case 'image/webp':
                return 'webp';
            case 'image/bmp':
                return 'bmp';
            case 'image/svg+xml':
                return 'svg';
            default:
                return 'jpg';
        }
    }

    const submitArticleContent = useCallback(async () => {
        if (!editor || !articleInfo.articleId) {
            return;
        }
        dispatch(editArticleSaveStatus('saving'))
        const json = editor.getJSON();
        const text = editor.getText();
        const images = [];

        const traverse = (node) => {
            if (node.type === 'image') {
                images.push(node.attrs.src);
            }
            if (node.content) {
                node.content.forEach(traverse);
            }
        };

        traverse(json);


        const formData = new FormData();
        formData.append('TextContent', text)
        formData.append('JsonContent', JSON.stringify(json))

        let index = 0;
        for (const src of images) {
            const response = await fetch(src);
            const blob = await response.blob();

            const extension = getExtensionFromDataURL(src);
            const fileName = `image${index}.${extension}`;
            formData.append('Images', blob, fileName);
            index++;
        }

        const url = `https://localhost:7219/api/articles/id/${articleInfo.articleId}/content`;
        await fetchData(
            url,
            "POST",
            formData,
            (data) => {
                let tempArticleInfo = produce(articleInfo, draft => {
                    draft.articleUpdatedTime = data
                    draft.articleJsonContent = JSON.stringify(json)
                })
                dispatch(editArticleSaveStatus('saved'))
                dispatch(editArticleInfo(tempArticleInfo))

            },
            (error) => {
                dispatch(editArticleSaveStatus('unsave'))
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleInfo.articleId, dispatch, editor]);

    const handleSubmit = useMemo(() => _.debounce(async () => {
        await submitArticleContent()
    }, 2000), [submitArticleContent]);


    useEffect(() => {
        return () => {
            handleSubmit.cancel();
        };
    }, [handleSubmit]);

    const handleCloseMenu = () => {
        setContextMenu(null);
    };

    const handleEditorAction = (action, level) => {
        if (editor && editor.isEditable) {  // Ensure the editor is editable
            switch (action) {
                case 'codeBlock':
                    editor.chain().focus().toggleCodeBlock().run();
                    break;
                case 'bulletList':
                    editor.chain().focus().toggleBulletList().run();
                    break;
                case 'orderedList':
                    editor.chain().focus().toggleOrderedList().run();
                    break;
                case 'bold':
                    editor.chain().focus().toggleBold().run();
                    break;
                case 'italic':
                    editor.chain().focus().toggleItalic().run();
                    break;
                case 'strike':
                    editor.chain().focus().toggleStrike().run();
                    break;
                case 'horizontalRule':
                    editor.chain().focus().setHorizontalRule().run();
                    break;
                case 'link':
                    const url = prompt("Enter the URL");
                    if (url) {
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }
                    break;
                case 'heading':
                    if (level) {
                        editor.chain().focus().toggleHeading({ level }).run();
                    }
                    break;
                case 'table':
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    break;
                default:
                    break;
            }
        }
    };

    // useEffect(() => {
    //     if (!editor) return;
    //     const handleKeyDown = (event) => {
    //         if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    //             event.preventDefault();
    //             console.log('save')
    //             handleSubmit(); // Call the save function
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [handleSubmit, editor]);

    return (
        <>
            <div className="toolbar">
                <button onClick={() => handleEditorAction('codeBlock')} title="Ctrl+Alt+C">
                    <FontAwesomeIcon icon={faCode} />
                </button>
                <button onClick={() => handleEditorAction('bulletList')} title="Ctrl+Shift+8">
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button onClick={() => handleEditorAction('orderedList')} title="Ctrl+Shift+7">
                    <FontAwesomeIcon icon={faListOl} />
                </button>
                <button onClick={() => handleEditorAction('bold')} title="Ctrl+B">
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button onClick={() => handleEditorAction('italic')} title="Ctrl+I">
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button onClick={() => handleEditorAction('strike')} title="Ctrl+Shift+S">
                    <FontAwesomeIcon icon={faStrikethrough} />
                </button>
                <button onClick={() => handleEditorAction('horizontalRule')} title="---">
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <button onClick={() => handleEditorAction('link')} title="Ctrl+K">
                    <FontAwesomeIcon icon={faLink} />
                </button>
                <button onClick={() => handleEditorAction('heading', 1)} title="Ctrl+Alt+1">
                    <FontAwesomeIcon icon={faHeading} />1
                </button>
                <button onClick={() => handleEditorAction('heading', 2)} title="Ctrl+Alt+2">
                    <FontAwesomeIcon icon={faHeading} />2
                </button>
                <button onClick={() => handleEditorAction('heading', 3)} title="Ctrl+Alt+3">
                    <FontAwesomeIcon icon={faHeading} />3
                </button>
                <button onClick={() => handleEditorAction('table')} title="Table">
                    <FontAwesomeIcon icon={faTable} />
                </button>
                {/* Add more buttons as needed */}
            </div>

            <EditorContent editor={editor} />
            {contextMenu && editor && (
                <TableContextMenu
                    editor={editor}
                    position={contextMenu}
                    onClose={handleCloseMenu}
                />
            )}
        </>
    );
};

export default TiptapTextArea;
