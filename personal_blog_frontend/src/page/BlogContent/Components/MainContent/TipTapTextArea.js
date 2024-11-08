import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import DragHandle from '@tiptap-pro/extension-drag-handle-react'
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
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import csharp from 'highlight.js/lib/languages/csharp'
import { createLowlight } from 'lowlight'

import { fetchData } from '../../../../utils/apiService'
import { useSelector } from 'react-redux'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editArticleSaveStatus, editArticleInfo } from '../../../../store/modules/blogContentMainContentStore'
import './TipTapTextArea.css'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import _ from 'lodash'

const TiptapTextArea = ({ dispatch }) => {
    const [contextMenu, setContextMenu] = useState(null);
    const lowlight = createLowlight();
    lowlight.register({ csharp })
    const {
        articleInfo
    } = useSelector(state => state.blogContentMainContent)


    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Dropcursor,
            Gapcursor,
            Heading,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            History,
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
                    console.log('drop')
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
            // console.log(editor)
            dispatch(editArticleSaveStatus('unsave'))
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
        if (editor && articleInfo.articleId) {
            editor.commands.setContent(JSON.parse(articleInfo.articleJsonContent));
        }
    }, [editor, articleInfo])



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


    const handleSubmit = React.useMemo(() =>
        _.debounce(async () => {

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
                    dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
                }
            )
        }, 3000),
        [articleInfo, dispatch, editor]
    );

    useEffect(() => {
        return () => {
            handleSubmit.cancel();
        };
    }, [handleSubmit]);
    const handleCloseMenu = () => setContextMenu(null);

    return (
        <>
            <DragHandle editor={editor}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
            </DragHandle>
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
