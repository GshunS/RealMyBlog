import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block'
import './TipTapTextArea.css'
import { useEffect, useRef } from 'react'


const TiptapTextArea = () => {
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
            Image
        ],
        content: `        <img src="https://placehold.co/200x100" />      `,
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
                        editor.chain().focus().setImage({ src: reader.result }).run();
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        onCreate: (event) => {
            const lastPos = editor.state.doc.content.size;
            editor.commands.insertContentAt(lastPos, '<p></p>');
            editor.commands.focus();
        },


    });

    const handleClick = () => {
        // console.log(editor.isFocused)
    }
    const timerRef = useRef(null);

    const handleSubmit = async () => {
        if (!editor) {
            return;
        }

        const content = editor.getHTML();
        console.log('提交成功:', content);
        // try {
        //     const response = await axios.post('http://your-backend-api.com/submit', {
        //         content,
        //     });

        //     console.log('提交成功:', response.data);
        // } catch (error) {
        //     console.error('提交失败:', error);
        // }
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
        <div className="tiptap-editor" onClick={handleClick}>
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapTextArea;
