import { Editor } from '@tiptap/react';
import { Pane, Button, majorScale } from 'evergreen-ui';

interface EditorMenuBarProps {
    editor: Editor;
}

export const EditorMenuBar = ({ editor }: EditorMenuBarProps) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <Pane
            borderBottom="default"
            padding={majorScale(1)}
            display="flex"
            gap={majorScale(1)}
            flexWrap="wrap"
            background="tint1"
        >
            <Button
                size="small"
                appearance={editor.isActive('bold') ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </Button>
            <Button
                size="small"
                appearance={editor.isActive('italic') ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </Button>
            <Button
                size="small"
                appearance={editor.isActive('strike') ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                Strike
            </Button>
            <Pane width={1} background="muted" marginX={majorScale(1)} />
            <Button
                size="small"
                appearance={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                H1
            </Button>
            <Button
                size="small"
                appearance={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </Button>
            <Button
                size="small"
                appearance={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                H3
            </Button>
            <Pane width={1} background="muted" marginX={majorScale(1)} />
            <Button
                size="small"
                appearance={editor.isActive('bulletList') ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                • List
            </Button>
            <Button
                size="small"
                appearance={editor.isActive('orderedList') ? 'primary' : 'default'}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                1. List
            </Button>
            <Pane width={1} background="muted" marginX={majorScale(1)} />
            <Button
                size="small"
                onClick={addLink}
            >
                🔗 Link
            </Button>
            <Button
                size="small"
                onClick={addImage}
            >
                🖼️ Image
            </Button>
            <Pane width={1} background="muted" marginX={majorScale(1)} />
            <Button
                size="small"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                ↶ Undo
            </Button>
            <Button
                size="small"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                ↷ Redo
            </Button>
        </Pane>
    );
};
