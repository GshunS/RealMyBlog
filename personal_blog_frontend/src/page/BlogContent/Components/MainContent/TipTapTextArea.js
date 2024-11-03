import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Dropcursor from '@tiptap/extension-dropcursor'
// import CodeBlock from '@tiptap/extension-code-block'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import History from '@tiptap/extension-history'
import csharp from 'highlight.js/lib/languages/csharp'
import { createLowlight } from 'lowlight'

import ResizableImageExtension from './TipTapCustomExtensions/ResizableImageTemplate';
import IndentHandler from "./TipTapCustomExtensions/IndentHandler";
import ImageClipboardHandler from "./TipTapCustomExtensions/ImageClipboardHandler";

import { fetchData } from '../../../../utils/apiService'
import { useSelector, useDispatch } from 'react-redux'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editArticleSaveStatus, editArticleInfo } from '../../../../store/modules/blogContentMainContentStore'
import './TipTapTextArea.css'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import _ from 'lodash'

const TiptapTextArea = ({dispatch}) => {
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
        ],
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
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        editor.chain().focus().setImage({ src: reader.result, width: 200, height: 200 }).run();
                    };

                    reader.readAsDataURL(file);
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
            // console.log(JSON.parse(articleInfo.articleJsonContent))
            editor.commands.setContent(JSON.parse(articleInfo.articleJsonContent));
        }
    }, [articleInfo, editor])

    const handleClick = () => {
        // console.log(editor.isFocused)
    }

    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', 'dragging-image');
        setIsDragging(true);
    };

    const handleDragEnd = (event) => {
        event.preventDefault();
        setIsDragging(false);
        event.dataTransfer.clearData();

    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (!isDragging) {
            const files = Array.from(event.dataTransfer.files);

            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        editor
                            .chain()
                            .focus()
                            .setImage({ src: reader.result, width: 200, height: 200 })
                            .run();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

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
            // console.log(json)
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

            // console.log(json);

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


    return (
        <div
            className="tiptap-editor"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapTextArea;
