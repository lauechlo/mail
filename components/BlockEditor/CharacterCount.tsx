import { Editor } from '@tiptap/react';
import { Pane, Text, majorScale } from 'evergreen-ui';
import { useState, useEffect } from 'react';

interface CharacterCountProps {
    editor: Editor | null;
}

export const CharacterCount = ({ editor }: CharacterCountProps) => {
    const [stats, setStats] = useState({
        characters: 0,
        words: 0,
        readingTime: 0,
    });

    useEffect(() => {
        if (!editor) return;

        const updateStats = () => {
            const text = editor.getText();
            const characters = text.length;
            const words = text.split(/\s+/).filter(word => word.length > 0).length;
            const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min

            setStats({ characters, words, readingTime });
        };

        // Update on editor content change
        editor.on('update', updateStats);
        updateStats(); // Initial count

        return () => {
            editor.off('update', updateStats);
        };
    }, [editor]);

    return (
        <Pane
            borderTop="default"
            padding={majorScale(1)}
            background="tint1"
            display="flex"
            gap={majorScale(3)}
            fontSize={12}
        >
            <Text size={300} color="muted">
                📊 <strong>{stats.characters}</strong> characters
            </Text>
            <Text size={300} color="muted">
                📝 <strong>{stats.words}</strong> words
            </Text>
            <Text size={300} color="muted">
                ⏱️ <strong>~{stats.readingTime}</strong> min read
            </Text>
        </Pane>
    );
};
