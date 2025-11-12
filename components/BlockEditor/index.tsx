'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { FormField } from 'evergreen-ui';
import { useEffect } from 'react';
import 'tippy.js/dist/tippy.css';
import './styles.css';
import { EditorMenuBar } from './MenuBar';
import { SlashCommandExtension } from './SlashCommands';
import { CharacterCount } from './CharacterCount';
import { ImageUploadExtension, uploadImageToImgur } from './ImageUpload';
import { EventBlock, CalloutBox, CTAButton } from './CustomBlocks';

interface BlockEditorProps {
    onChange: (content: string) => void;
    label: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    isDisabled?: boolean;
    value?: string;
}

export default function BlockEditor({
    onChange,
    label,
    placeholder = 'Type / for commands...',
    description,
    required = false,
    isDisabled = false,
    value = '',
}: BlockEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-500 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-lg',
                },
            }),
            ImageUploadExtension.configure({
                onUpload: uploadImageToImgur,
            }),
            EventBlock,
            CalloutBox,
            CTAButton,
            SlashCommandExtension,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !isDisabled,
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <FormField
            label={label}
            required={required}
            description={description}
            marginBottom='24px'
        >
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                {editor && <EditorMenuBar editor={editor} />}
                <EditorContent editor={editor} />
                {editor && <CharacterCount editor={editor} />}
            </div>
        </FormField>
    );
}
