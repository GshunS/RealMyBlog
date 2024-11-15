import React from 'react';
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
    const [cursorPos, setCursorPos] = useState(0);
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
        ],
        editorProps: {
            handleDOMEvents: {
                contextmenu: (view, event) => {
                    const target = event.target;
                    if (target.closest("td") || target.closest("th")) {
                        event.preventDefault();
                        const { clientX: x, clientY: y } = event;
                        Promise.resolve().then(() => {
                            setContextMenu({ x, y });
                        });
                        return true;
                    }
                    return false;
                },
            },
        },
        content: '',

        // editable: false,
        onUpdate: ({ editor }) => {
            const { from, to } = editor.view.state.selection;
            setCursorPos(editor.state.selection.$anchor.pos);
            const startDOM = editor.view.domAtPos(from).node;
            if (startDOM && startDOM instanceof HTMLElement) {
                startDOM.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
            Promise.resolve().then(() => {
                dispatch(editArticleSaveStatus('unsave'));
                handleSubmit();
            });
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

    const submitArticleContent = async () => {
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
    };

    const handleSubmit = _.debounce(async () => await submitArticleContent(), 1000)


    useEffect(() => {
        return () => {
            handleSubmit.cancel();
        };
    }, [handleSubmit]);

    const handleCloseMenu = () => {
        Promise.resolve().then(() => {
            setContextMenu(null);
        });
    };

    const handleCreateCodeBlock = () => {
        if (editor) {
            editor.chain().focus().toggleCodeBlock().run();
        }
    };

    const handleCreateBulletList = () => {
        if (editor) {
            editor.chain().focus().toggleBulletList().run();
        }
    };

    const handleCreateOrderedList = () => {
        if (editor) {
            editor.chain().focus().toggleOrderedList().run();
        }
    };

    const handleToggleBold = () => {
        if (editor) {
            editor.chain().focus().toggleBold().run();
        }
    };

    const handleToggleItalic = () => {
        if (editor) {
            editor.chain().focus().toggleItalic().run();
        }
    };

    const handleToggleStrike = () => {
        if (editor) {
            editor.chain().focus().toggleStrike().run();
        }
    };

    const handleInsertHorizontalRule = () => {
        if (editor) {
            editor.chain().focus().setHorizontalRule().run();
        }
    };

    const handleInsertLink = () => {
        const url = prompt("Enter the URL");
        if (editor && url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const handleInsertHeading = (level) => {
        if (editor) {
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    const handleInsertTable = () => {
        if (editor) {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }
    };

    return (
        <>
            <div className="toolbar">
                <button onClick={handleCreateCodeBlock} title="Ctrl+Alt+C">
                    <FontAwesomeIcon icon={faCode} />
                </button>
                <button onClick={handleCreateBulletList} title="Ctrl+Shift+8">
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button onClick={handleCreateOrderedList} title="Ctrl+Shift+7">
                    <FontAwesomeIcon icon={faListOl} />
                </button>
                <button onClick={handleToggleBold} title="Ctrl+B">
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button onClick={handleToggleItalic} title="Ctrl+I">
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button onClick={handleToggleStrike} title="Ctrl+Shift+S">
                    <FontAwesomeIcon icon={faStrikethrough} />
                </button>
                <button onClick={handleInsertHorizontalRule} title="---">
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <button onClick={handleInsertLink} title="Ctrl+K">
                    <FontAwesomeIcon icon={faLink} />
                </button>
                <button onClick={() => handleInsertHeading(1)} title="Ctrl+Alt+1">
                    <FontAwesomeIcon icon={faHeading} />1
                </button>
                <button onClick={() => handleInsertHeading(2)} title="Ctrl+Alt+2">
                    <FontAwesomeIcon icon={faHeading} />2
                </button>
                <button onClick={() => handleInsertHeading(3)} title="Ctrl+Alt+3">
                    <FontAwesomeIcon icon={faHeading} />3
                </button>
                <button onClick={handleInsertTable} title="Table">
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
