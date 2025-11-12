import { Node, mergeAttributes } from '@tiptap/core';

// Event Block Node
export const EventBlock = Node.create({
    name: 'eventBlock',
    group: 'block',
    content: 'block+',
    parseHTML() {
        return [
            {
                tag: 'div.event-block',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'event-block',
                style: 'background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;',
            }),
            0,
        ];
    },
});

// Callout Box Node (for deadline, info, etc.)
export const CalloutBox = Node.create({
    name: 'calloutBox',
    group: 'block',
    content: 'block+',
    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: element => element.getAttribute('data-type'),
                renderHTML: attributes => {
                    return {
                        'data-type': attributes.type,
                    };
                },
            },
            style: {
                default: null,
                parseHTML: element => element.getAttribute('style'),
                renderHTML: attributes => {
                    return {
                        style: attributes.style,
                    };
                },
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-callout]',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-callout': true,
            }),
            0,
        ];
    },
});

// CTA Button Node
export const CTAButton = Node.create({
    name: 'ctaButton',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            href: {
                default: '#',
            },
            text: {
                default: 'Click Here',
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div.cta-button-wrapper',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            {
                class: 'cta-button-wrapper',
                style: 'text-align: center; margin: 24px 0;',
            },
            [
                'a',
                {
                    href: HTMLAttributes.href,
                    style: 'display: inline-block; background: #FF6900; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;',
                    target: '_blank',
                },
                HTMLAttributes.text,
            ],
        ];
    },
});
