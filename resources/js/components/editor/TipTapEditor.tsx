import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useRef, useState } from 'react';
import {
    Bold,
    Italic,
    Link as LinkIcon,
    Image as ImageIcon,
    Plus,
    Type,
    List,
    ListOrdered,
    Quote,
    Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TipTapEditorProps {
    content?: string;
    onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg lg:prose-xl max-w-none focus:outline-none min-h-[600px]',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== undefined && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editor) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                editor.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLinkAdd = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const insertBlock = (type: string) => {
        if (!editor) return;

        switch (type) {
            case 'heading2':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
            case 'heading3':
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                break;
            case 'bulletList':
                editor.chain().focus().toggleBulletList().run();
                break;
            case 'orderedList':
                editor.chain().focus().toggleOrderedList().run();
                break;
            case 'blockquote':
                editor.chain().focus().toggleBlockquote().run();
                break;
            case 'divider':
                editor.chain().focus().setHorizontalRule().run();
                break;
            case 'image':
                handleImageUpload();
                break;
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="relative">
            {/* Bubble Menu - Medium Style (Simple) */}
            <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="flex items-center gap-0.5 bg-background border rounded-md shadow-lg px-1 py-1"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 px-2 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 px-2 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLinkAdd}
                    className={`h-8 px-2 ${editor.isActive('link') ? 'bg-muted' : ''}`}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </BubbleMenu>

            {/* Floating Menu - Medium Style Plus Button */}
            <FloatingMenu
                editor={editor}
                tippyOptions={{ duration: 100, placement: 'left' }}
                className="flex items-center"
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full border border-muted-foreground/20 hover:border-muted-foreground/40"
                            type="button"
                        >
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-48">
                        <DropdownMenuItem onClick={() => insertBlock('heading2')}>
                            <Type className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Heading</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertBlock('bulletList')}>
                            <List className="h-4 w-4 mr-2" />
                            <span>Bulleted List</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertBlock('orderedList')}>
                            <ListOrdered className="h-4 w-4 mr-2" />
                            <span>Numbered List</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertBlock('blockquote')}>
                            <Quote className="h-4 w-4 mr-2" />
                            <span>Quote</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertBlock('divider')}>
                            <Minus className="h-4 w-4 mr-2" />
                            <span>Divider</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertBlock('image')}>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            <span>Image</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </FloatingMenu>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Editor Content - No Border, Clean */}
            <EditorContent editor={editor} />
        </div>
    );
}
