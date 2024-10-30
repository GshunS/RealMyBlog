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
import CodeBlock from '@tiptap/extension-code-block'
import ResizableImageExtension from './ResizableImageTemplate';
import { fetchData } from '../../../../utils/apiService'
import { useSelector, useDispatch } from 'react-redux'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editArticleInfo } from '../../../../store/modules/blogContentMainContentStore'
import './TipTapTextArea.css'
import { produce } from 'immer'
import { useEffect, useRef } from 'react'


const TiptapTextArea = () => {
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
            CodeBlock,
            BulletList, OrderedList, ListItem,
            ResizableImageExtension
        ],
        content: '',

        // editable: false,
        onUpdate: ({ editor }) => {
            resetAutoSubmit();
        },
        onPaste: (event) => {
            event.preventDefault();
            const items = event.clipboardData.items;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = () => {
                        editor.chain().focus().setImage({
                            src: reader.result,
                            width: 300,
                            height: 200
                        }).run();
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        onCreate: (event) => {
            // const lastPos = editor.state.doc.content.size;
            // editor.commands.insertContentAt(lastPos, '<p></p>');
            editor.commands.focus();
        },


    });

    useEffect(() => {
        if (editor && articleInfo.articleId) {
            console.log(JSON.parse(articleInfo.articleJsonContent))
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

    const timerRef = useRef(null);

    const handleSubmit = async () => {
        if (!editor) {
            return;
        }

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
            formData.append('Images', blob, `image${index}.png`);
            index++;
        }
        // console.log(json);

        const url = `https://localhost:7219/api/articles/id/${articleInfo.articleId}/content`;
        await fetchData(
            url,
            "POST",
            formData,
            (data) => {
                // let newArticleInfo = produce(articleInfo, draft => {
                //     draft.articleUpdatedTime = data
                // });
                // dispatch(editArticleInfo(newArticleInfo))
                dispatch(editErrorMsg({ type: 'INFO', msg: "Saved!" }))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
            }
        )
    };

    const resetAutoSubmit = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            handleSubmit();
        }, 5000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


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
