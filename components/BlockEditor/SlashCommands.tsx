import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { SlashCommandsList } from './SlashCommandsList';

export const SlashCommandExtension = Extension.create({
    name: 'slashCommands',

    addOptions() {
        return {
            suggestion: slashCommandSuggestion,
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const slashCommandSuggestion = {
    char: '/',
    command: ({ editor, range, props }) => {
        props.command({ editor, range });
    },
    items: ({ query }) => {
        return [
            {
                title: 'Event',
                description: 'Add an event block with date, time, and location',
                icon: '📅',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'eventBlock',
                            content: [
                                {
                                    type: 'heading',
                                    attrs: { level: 3 },
                                    content: [{ type: 'text', text: '📅 Event Title' }],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: 'Date: ' },
                                        { type: 'text', text: '[Add date]' },
                                    ],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: 'Time: ' },
                                        { type: 'text', text: '[Add time]' },
                                    ],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: 'Location: ' },
                                        { type: 'text', text: '[Add location]' },
                                    ],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: 'RSVP: ' },
                                        { type: 'text', text: '[Add link]' },
                                    ],
                                },
                            ],
                        })
                        .run();
                },
            },
            {
                title: 'Call-to-Action Button',
                description: 'Insert a prominent CTA button',
                icon: '🔘',
                command: ({ editor, range }) => {
                    const buttonText = window.prompt('Button text:', 'Click Here') || 'Click Here';
                    const buttonLink = window.prompt('Button link:', 'https://') || '#';
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'ctaButton',
                            attrs: {
                                text: buttonText,
                                href: buttonLink,
                            },
                        })
                        .run();
                },
            },
            {
                title: 'Divider',
                description: 'Add a visual separator',
                icon: '➖',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent('<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 24px 0;" />')
                        .run();
                },
            },
            {
                title: 'Deadline Reminder',
                description: 'Highlight an important deadline',
                icon: '⏰',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'calloutBox',
                            attrs: {
                                type: 'deadline',
                                style: 'background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 16px 0; border-radius: 4px;',
                            },
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: '⏰ Deadline: ' },
                                        { type: 'text', text: '[Add date and details]' },
                                    ],
                                },
                            ],
                        })
                        .run();
                },
            },
            {
                title: 'Info Box',
                description: 'Add an informational callout box',
                icon: 'ℹ️',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'calloutBox',
                            attrs: {
                                type: 'info',
                                style: 'background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 16px 0; border-radius: 4px;',
                            },
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', marks: [{ type: 'bold' }], text: 'ℹ️ Note: ' },
                                        { type: 'text', text: 'Add your information here' },
                                    ],
                                },
                            ],
                        })
                        .run();
                },
            },
            {
                title: 'Two Column Layout',
                description: 'Create a two-column section',
                icon: '📐',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent(
                            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;"><div style="background: #f9fafb; padding: 16px; border-radius: 8px;"><h4>Column 1</h4><p>Add content here</p></div><div style="background: #f9fafb; padding: 16px; border-radius: 8px;"><h4>Column 2</h4><p>Add content here</p></div></div>'
                        )
                        .run();
                },
            },
        ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
    },

    render: () => {
        let component;
        let popup;

        return {
            onStart: (props) => {
                console.log('Slash command triggered!', props);
                component = new ReactRenderer(SlashCommandsList, {
                    props,
                    editor: props.editor,
                });

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
                console.log('Popup created:', popup);
            },

            onUpdate(props) {
                component.updateProps(props);

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
