import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
// import Image from '@tiptap/extension-image';
// import CodeBlock from '@tiptap/extension-code-block'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
import { useEffect } from 'react'
import _ from 'lodash'

const TiptapTextArea = () => {
    const lowlight = createLowlight();
    lowlight.register({ csharp })
    // console.log(lowlight.listLanguages())
    const dispatch = useDispatch();
    const {
        articleInfo
    } = useSelector(state => state.blogContentMainContent)


    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Link.configure({
                openOnClick: false,
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
        ],
        content: '',

        // editable: false,
        onUpdate: ({ editor }) => {
            // console.log(editor)
            dispatch(editArticleSaveStatus('unsave'))
            handleSubmit();
        },
        onCreate: (event) => {
            editor.commands.focus();
        },


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

    const handleDrop = (event) => {
        event.preventDefault();

        const files = Array.from(event.dataTransfer.files);

        files.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: reader.result, width: 300, height: 200 })
                        .run();
                };
                reader.readAsDataURL(file);
            }
        });
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapTextArea;
