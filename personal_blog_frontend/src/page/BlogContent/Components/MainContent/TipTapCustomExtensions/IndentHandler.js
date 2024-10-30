import { Extension } from "@tiptap/core";

const TAB_CHAR = "\u0009"; // Unicode character for a tab

const IndentHandler = Extension.create({
  name: "indentHandler",

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if we're at the start of a list item
        if (editor.isActive("listItem") && $from.parentOffset === 0) {
          // Try to sink the list item (indent it deeper)
          const sinkResult = editor.chain().sinkListItem("listItem").run();

          if (sinkResult) return true; // Successful sink, stop further actions
        }

        // Otherwise, insert a tab character at the current position
        editor
          .chain()
          .command(({ tr }) => {
            tr.insertText(TAB_CHAR);
            return true;
          })
          .run();

        return true; // Prevent default focus loss
      },

      "Shift-Tab": ({ editor }) => {
        const { selection, doc } = editor.state;
        const { $from } = selection;
        const pos = $from.pos;

        // If we're at the start of a list item, lift the item (outdent)
        if (editor.isActive("listItem") && $from.parentOffset === 0) {
          return editor.chain().liftListItem("listItem").run();
        }

        // If the previous character is a tab, delete it
        if (doc.textBetween(pos - 1, pos) === TAB_CHAR) {
          editor
            .chain()
            .command(({ tr }) => {
              tr.delete(pos - 1, pos);
              return true;
            })
            .run();
          return true; // Tab removed, prevent default behavior
        }

        return true; // Prevent default behavior
      },
    };
  },
});

export default IndentHandler;
