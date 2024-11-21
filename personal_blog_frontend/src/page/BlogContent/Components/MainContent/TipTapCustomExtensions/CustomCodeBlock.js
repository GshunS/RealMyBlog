import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';

const CustomCodeBlock = CodeBlockLowlight.extend({
    addKeyboardShortcuts() {
        const insertPair = (chars) => {
            if (this.editor.state.selection.$from.parent.type.name === 'codeBlock') {
                const { from } = this.editor.state.selection;
                const tr = this.editor.state.tr;
                tr.insertText(chars, from);
                tr.setSelection(this.editor.state.selection.constructor.near(tr.doc.resolve(from + 1)));
                this.editor.view.dispatch(tr);
                return true;
            }
            return false;
        };

        return {
            '{': () => insertPair('{}'),
            '[': () => insertPair('[]'),
            '(': () => insertPair('()'),
            "'": () => insertPair("''"),
            '"': () => insertPair('""'),
            'ArrowDown': () => {
                if (this.editor.state.selection.$from.parent.type.name === 'codeBlock') {
                    const { $from } = this.editor.state.selection;
                    const end = $from.end();
                    
                    if ($from.pos >= end - 1) {
                        const after = this.editor.state.doc.nodeAt($from.after());
                        
                        if (!after) {
                            this.editor.chain()
                                .insertContentAt(end + 1, { type: 'paragraph' })
                                .focus(end + 2)
                                .run();
                            console.log(this.editor.getJSON());
                            return true;
                        }
                        console.log(this.editor.getJSON());
                    }
                }
                return false;
            },
            'Enter': () => {
                if (this.editor.state.selection.$from.parent.type.name === 'codeBlock') {
                    const { from } = this.editor.state.selection;
                    const doc = this.editor.state.doc;
                    const pos = from;

                    const beforeChar = doc.textBetween(Math.max(0, pos - 1), pos);
                    const afterChar = doc.textBetween(pos, Math.min(doc.content.size, pos + 1));

                    if (beforeChar === '{' && afterChar === '}') {
                        const tr = this.editor.state.tr;
                        tr.insertText('\n    \n', pos);
                        tr.setSelection(this.editor.state.selection.constructor.near(tr.doc.resolve(pos + 5)));
                        this.editor.view.dispatch(tr);
                        return true;
                    }
                }
                return false;
            },
            'Backspace': () => {
                if (this.editor.state.selection.$from.parent.type.name === 'codeBlock') {
                    const { from } = this.editor.state.selection;
                    const doc = this.editor.state.doc;

                    const beforeChar = doc.textBetween(Math.max(0, from - 1), from);
                    const afterChar = doc.textBetween(from, Math.min(doc.content.size, from + 1));

                    const isPairedChars = (
                        (beforeChar === '(' && afterChar === ')') ||
                        (beforeChar === '[' && afterChar === ']') ||
                        (beforeChar === '{' && afterChar === '}') ||
                        (beforeChar === '"' && afterChar === '"') ||
                        (beforeChar === "'" && afterChar === "'")
                    );

                    if (isPairedChars) {
                        const tr = this.editor.state.tr;
                        tr.delete(from - 1, from + 1);
                        this.editor.view.dispatch(tr);
                        return true;
                    }
                }
                return false;
            },
        };
    },
});

export default CustomCodeBlock;
