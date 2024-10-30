import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state"; // 确保引入了 Plugin

const ImageClipboardHandler = Extension.create({
  name: "imageClipboardHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            copy: (view, event) => {
              const { state, dispatch } = view;
              const { selection } = state;
              const node = selection.node;

              // 如果当前选中的是图片节点，将其添加到剪贴板
              if (node?.type.name === "image") {
                event.preventDefault();
                const img = document.createElement("img");
                img.src = node.attrs.src;

                const dataTransfer = event.clipboardData;
                dataTransfer.setData("text/html", img.outerHTML);
                dataTransfer.setData("text/plain", node.attrs.src);
              }
            },
            
          },
        },
      }),
    ];
  },
});

export default ImageClipboardHandler;
