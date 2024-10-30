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

                            if (node?.type.name === "image") {
                                event.preventDefault();
                                const img = document.createElement("img");
                                img.src = node.attrs.src;

                                const dataTransfer = event.clipboardData;
                                dataTransfer.setData("text/html", img.outerHTML);
                                dataTransfer.setData("text/plain", node.attrs.src);
                            }
                        },
                        paste: (view, event) => {
                            const { clipboardData } = event;
                            const htmlData = clipboardData.getData("text/html");
                            const src = clipboardData.getData("text/plain");

                            if (htmlData.includes("<img")) {
                                event.preventDefault();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(htmlData, "text/html");
                                const img = doc.querySelector("img");

                                if (img) {
                                    view.dispatch(
                                        view.state.tr.replaceSelectionWith(
                                            view.state.schema.nodes.image.create({
                                                src: img.src,
                                                width: 300,
                                                height: 200
                                            })
                                        )
                                    );
                                }
                            } else if (src.startsWith("http")) {
                                event.preventDefault();
                                view.dispatch(
                                    view.state.tr.replaceSelectionWith(
                                        view.state.schema.nodes.image.create({
                                            src,
                                            width: 300,
                                            height: 200
                                        })
                                    )
                                );
                            }
                        },
                    },
                },
            }),
        ];
    },
});

export default ImageClipboardHandler;
