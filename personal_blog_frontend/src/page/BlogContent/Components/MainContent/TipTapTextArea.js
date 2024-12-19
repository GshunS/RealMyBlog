import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faListUl, faListOl, faBold, faItalic, faStrikethrough, faLink, faMinus, faHeading, faTable, faPalette, faTextHeight, faRedo, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { HexColorPicker } from 'react-colorful';

import FileHandler from '@tiptap-pro/extension-file-handler';
import ResizableImageExtension from './TipTapCustomExtensions/ResizableImageTemplate';
import IndentHandler from './TipTapCustomExtensions/IndentHandler';
import ImageClipboardHandler from './TipTapCustomExtensions/ImageClipboardHandler';
import TableContextMenu from './TableContextMenu';
import CustomCodeBlock from './TipTapCustomExtensions/CustomCodeBlock';

import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Dropcursor from '@tiptap/extension-dropcursor';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import Gapcursor from '@tiptap/extension-gapcursor';
import Strike from '@tiptap/extension-strike';
import Details from '@tiptap-pro/extension-details'
import DetailsContent from '@tiptap-pro/extension-details-content'
import DetailsSummary from '@tiptap-pro/extension-details-summary'

import sql from 'highlight.js/lib/languages/sql';
import csharp from 'highlight.js/lib/languages/csharp';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import { createLowlight } from 'lowlight';

import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import History from '@tiptap/extension-history';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from './TipTapCustomExtensions/FontSize';

import { fetchData } from '../../../../utils/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore';
import { editArticleSaveStatus, editArticleInfo } from '../../../../store/modules/blogContentMainContentStore';

import './TipTapTextArea.css';
import { produce } from 'immer';
import _ from 'lodash';

const TiptapTextArea = () => {
    const [contextMenu, setContextMenu] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState('#000000');
    const { tokenValid } = useSelector(state => state.blogContentLogin);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const [currentEditor, setCurrentEditor] = useState(null);

    const lowlight = createLowlight();
    lowlight.register({ javascript, xml, sql, csharp, python, css });
    const colorPickerRef = useRef(null);
    const colorPickerButtonRef = useRef(null);

    const { articleInfo, articleSaveStatus } = useSelector(state => state.blogContentMainContent);

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
            CustomCodeBlock.configure({
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
                        const fileReader = new FileReader();

                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            currentEditor.chain().insertContentAt(pos, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result,
                                    width: 200,
                                    height: 200
                                },
                            }).focus().run();
                        };
                    });
                },
            }),
            Bold,
            Italic,
            History.configure({
                newGroupDelay: 100,
            }),
            TextStyle,
            FontSize,
            Color,
            Details.configure({
                persist: true,
                openClassName: 'is-open',
                HTMLAttributes: {
                    class: 'details',
                }
            }),
            DetailsSummary,
            DetailsContent,
        ],
        editorProps: {
            handleDOMEvents: {
                contextmenu: (view, event) => {
                    const target = event.target;
                    if ((target.closest("td") || target.closest("th")) && editor?.isEditable) {
                        event.preventDefault();
                        const { clientX: x, clientY: y } = event;
                        setContextMenu({ x, y });
                        return true;
                    }
                    return false;
                },
            },
            handleKeyDown: (view, event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'c' && !view.state.selection.empty) {
                    return false;
                }

                if ((event.ctrlKey || event.metaKey) && event.key === 'x' && !view.state.selection.empty) {
                    return false;
                }

                if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'x')) {
                    if (view.state.selection.empty) {
                        const $pos = view.state.selection.$from;
                        const node = $pos.node();

                        if (!node) return false;

                        const from = $pos.start();
                        const to = $pos.end();

                        const text = node.textContent;

                        navigator.clipboard.writeText(text);

                        if (event.key === 'x') {
                            view.dispatch(view.state.tr.delete(from, to));
                        }

                        return true;
                    }
                }

                return false;
            },
        },
        content: '',

        onUpdate: ({ editor }) => {
            if (!editor.isEditable) {
                return;
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

                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        editor.chain().insertContentAt(editor.state.selection.anchor, {
                            type: 'image',
                            attrs: {
                                src: fileReader.result,
                                width: 200,
                                height: 200
                            },
                        }).focus().run();
                    };
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
        },
        onDestroy: async () => {
            if (articleSaveStatus === 'saving' || articleSaveStatus === 'unsave') {
                if (tokenValid && submitArticleContent) {
                    await submitArticleContent(currentArticleId, currentEditor);
                }
            }
            if (handleSubmit) {
                handleSubmit.cancel();
            }
        },
        onCreate: () => {
            setCurrentArticleId(articleInfo.articleId);
            setCurrentEditor(editor);
        }
    });

    useEffect(() => {
        editor.setEditable(tokenValid, false);
    }, [dispatch, editor, tokenValid]);

    useEffect(() => {
        if (editor && articleInfo.articleId) {
            editor.commands.setContent(JSON.parse(articleInfo.articleJsonContent));
            editor.commands.focus('start', { scrollIntoView: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, articleInfo.articleId]);

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

    const submitArticleContent = useCallback(async (currentArtId = null, currentEditor = null) => {
        if (!editor || !articleInfo.articleId) {
            return;
        }
        const articleId = currentArtId || articleInfo.articleId;
        const preEditor = currentEditor || editor;
        dispatch(editArticleSaveStatus('saving'));
        const json = preEditor.getJSON();
        const text = preEditor.getText();
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
        formData.append('TextContent', text);
        formData.append('JsonContent', JSON.stringify(json));

        let index = 0;
        for (const src of images) {
            const response = await fetch(src);
            const blob = await response.blob();

            const extension = getExtensionFromDataURL(src);
            const fileName = `image${index}.${extension}`;
            formData.append('Images', blob, fileName);
            index++;
        }

        const url = `${process.env.REACT_APP_API_URL}/articles/id/${articleId}/content`;
        await fetchData(
            url,
            "POST",
            formData,
            (data) => {
                let tempArticleInfo = produce(articleInfo, draft => {
                    draft.articleUpdatedTime = data;
                    draft.articleJsonContent = JSON.stringify(json);
                });
                dispatch(editArticleSaveStatus('saved'));
                dispatch(editArticleInfo(tempArticleInfo));
            },
            (error) => {
                dispatch(editArticleSaveStatus('unsave'));
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }));
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleInfo.articleId, dispatch, editor]);

    const handleSubmit = useMemo(() => _.debounce(async () => {
        await submitArticleContent();
    }, 1000), [submitArticleContent]);

    useEffect(() => {
        return () => {
            handleSubmit.cancel();
        };
    }, [handleSubmit]);

    const handleCloseMenu = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        const editorElement = document.querySelector('.ProseMirror');
        if (!editorElement) return;
        if (!showColorPicker) {
            editorElement.classList.remove('disable-selection');
            return
        };
        editorElement.classList.add('disable-selection');
        const handleClickOutside = (event) => {
            if (showColorPicker && !colorPickerRef.current.contains(event.target) && !colorPickerButtonRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            editorElement.classList.remove('disable-selection');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    const handleColorChange = (color) => {
        setColor(color);
        if (editor && editor.isEditable) {
            editor.chain().focus().setColor(color).run();
        }
    };

    const handleEditorAction = (action, level) => {
        if (editor && editor.isEditable) {
            switch (action) {
                case 'codeBlock':
                    // console.log(editor.getJSON());
                    const isCodeBlock = editor.state.selection.$from.parent.type.name === 'codeBlock';
                    if (isCodeBlock) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().toggleCodeBlock().run();
                    }
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
                case 'color':
                    setShowColorPicker(!showColorPicker);
                    break;
                case 'undo':
                    editor.chain().focus().undo().run();
                    break;
                case 'redo':
                    editor.chain().focus().redo().run();
                    break;
                case 'details':
                    editor.chain().focus().setDetails().run();
                    break;
                default:
                    break;
            }
        }
    };


    const [fontSizeDropdownPosition, setFontSizeDropdownPosition] = useState({ top: 0, left: 0 });
    const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
    const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
    const fontSizeButtonRef = useRef(null);
    const fontSizeDropdownRef = useRef(null);
    const toolbarRef = useRef(null);
    const [fontSize, setFontSize] = useState('16px');

    const handleFontSizeChange = (size) => {
        setShowFontSizeDropdown(false);
        setFontSize(size + 'px');
        if (editor && editor.isEditable) {
            editor.chain().focus().setFontSize(size + 'px').run();
        }
    };

    useEffect(() => {
        if (fontSizeButtonRef.current && toolbarRef.current) {
            const top = toolbarRef.current.offsetHeight + 5;
            const iconX = fontSizeButtonRef.current.getBoundingClientRect().x;
            const toolbarX = toolbarRef.current.getBoundingClientRect().x;
            const left = iconX - toolbarX;
            setFontSizeDropdownPosition({ top, left });
        }

    }, [fontSizeButtonRef, toolbarRef]);

    useEffect(() => {
        if (colorPickerButtonRef.current && toolbarRef.current) {
            const top = toolbarRef.current.offsetHeight + 5;
            const iconX = colorPickerButtonRef.current.getBoundingClientRect().x;
            const toolbarX = toolbarRef.current.getBoundingClientRect().x;
            const left = iconX - toolbarX;

            setColorPickerPosition({ top, left });
        }

    }, [colorPickerButtonRef, toolbarRef]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                fontSizeDropdownRef.current &&
                !fontSizeDropdownRef.current.contains(event.target) &&
                !fontSizeButtonRef.current.contains(event.target)
            ) {
                setShowFontSizeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (editor) {
            editor.chain().focus().setFontSize(fontSize).run();
        }
    }, [editor, fontSize]);

    useEffect(() => {
        if (!editor) return;

        const handleKeyDown = async (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                await submitArticleContent();
                if (handleSubmit) {
                    handleSubmit.cancel();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [submitArticleContent, editor, handleSubmit]);

    useEffect(() => {
        const toolbarOuter = document.querySelector('.toolbarOuter');
        if (!toolbarOuter) return;

        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const tiptapEditor = document.querySelector('.tiptap');
        if (!tiptapEditor) return;

        const diff = tiptapEditor.getBoundingClientRect().top - mainContent.getBoundingClientRect().top;

        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = `${diff}px`;
        sentinel.style.left = '0';
        sentinel.style.height = '1px';
        sentinel.style.width = '100%';
        sentinel.style.backgroundColor = 'transparent';
        toolbarOuter.parentElement.insertBefore(sentinel, toolbarOuter);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    toolbarOuter.classList.add('is-sticky');
                } else {
                    toolbarOuter.classList.remove('is-sticky');
                }
            },
            {
                threshold: [0],
                rootMargin: '-1px 0px 0px 0px'
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
            sentinel.remove();
        };
    }, []);

    return (
        <>
            <div className={`toolbarOuter ${tokenValid ? '' : 'hidden'}`}>
                <div className="toolbar" ref={toolbarRef}>
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
                    <button onClick={() => handleEditorAction('color')} title="Text Color" ref={colorPickerButtonRef}>
                        <FontAwesomeIcon icon={faPalette} />
                    </button>
                    {showColorPicker && (
                        <div
                            className="color-picker"
                            ref={colorPickerRef}
                            style={{
                                position: 'absolute',
                                top: colorPickerPosition.top,
                                left: colorPickerPosition.left,
                                width: '3rem',
                                height: '3rem'
                            }}>
                            <HexColorPicker color={color} onChange={handleColorChange} />
                        </div>
                    )}
                    <button ref={fontSizeButtonRef} onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)} title="Font Size">
                        <FontAwesomeIcon icon={faTextHeight} />
                    </button>
                    {showFontSizeDropdown && (
                        <div
                            className="font-size-dropdown"
                            ref={fontSizeDropdownRef}
                            style={{
                                top: fontSizeDropdownPosition.top,
                                left: fontSizeDropdownPosition.left
                            }}
                        >
                            {['12', '14', '16', '18', '20', '24', '28', '32'].map(size => (
                                <div key={size} onClick={() => handleFontSizeChange(size)}>
                                    {size}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* <button onClick={() => handleEditorAction('undo')} title="Undo (Ctrl+Z)">
                    <FontAwesomeIcon icon={faUndo} />
                </button> */}
                    <button onClick={() => handleEditorAction('redo')} title="Redo (Ctrl+Y)">
                        <FontAwesomeIcon icon={faRedo} />
                    </button>
                    <button onClick={() => handleEditorAction('details')} title="Insert Details">
                        <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} style={{'flexGrow': '1'}}/>
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
