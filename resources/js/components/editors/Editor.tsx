import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import "@/../css/editorjs.css"; // Import custom CSS

interface EditorProps {
    content?: any;
    onChange?: (content: any) => void;
    readOnly?: boolean;
}

export default function Editor({ content, onChange, readOnly = false }: EditorProps) {
    const editorRef = useRef<EditorJS | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isReadyRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Prevent double initialization
        if (editorRef.current) return;

        const editor = new EditorJS({
            holder: containerRef.current,
            readOnly: readOnly,
            placeholder: "Type '/' for commands",
            data: typeof content === 'string' ? JSON.parse(content) : content,
            tools: {
                header: {
                    class: Header as any,
                    config: {
                        placeholder: 'Heading',
                        levels: [1, 2, 3],
                        defaultLevel: 1
                    },
                    inlineToolbar: true
                },
                list: {
                    class: List as any,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote as any,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                code: Code as any,
                delimiter: Delimiter as any,
                inlineCode: {
                    class: InlineCode as any,
                },
                marker: {
                    class: Marker,
                },
                table: {
                    class: Table as any,
                    inlineToolbar: true,
                }
            },
            onChange: async (api) => {
                if (onChange) {
                    const savedData = await api.saver.save();
                    onChange(savedData);
                }
            },
            onReady: () => {
                isReadyRef.current = true;
            }
        });

        editorRef.current = editor;

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []); // Empty dependency array to run only once

    // Update content if changed externally (be careful with loops)
    // This is tricky with Editor.js as it doesn't support reactive updates well.
    // We'll skip this for now to avoid cursor jumping, assuming controlled by internal state mostly.

    return (
        <div className="w-full max-w-none prose prose-stone">
             <div
                ref={containerRef}
                className="min-h-[300px] w-full"
            />
        </div>
    );
}
