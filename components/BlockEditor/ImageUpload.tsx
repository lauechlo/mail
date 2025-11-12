import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

interface ImageUploadOptions {
    onUpload: (file: File) => Promise<string>;
}

export const ImageUploadExtension = Extension.create<ImageUploadOptions>({
    name: 'imageUpload',

    addOptions() {
        return {
            onUpload: async (file: File) => {
                // Default implementation
                return URL.createObjectURL(file);
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('imageUpload'),
                props: {
                    handleDrop: (view, event, slice, moved) => {
                        if (moved) return false;

                        const files = Array.from(event.dataTransfer?.files || []);
                        const imageFiles = files.filter(file => file.type.startsWith('image/'));

                        if (imageFiles.length === 0) return false;

                        event.preventDefault();

                        const { schema } = view.state;
                        const coordinates = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });

                        imageFiles.forEach(async (file) => {
                            try {
                                const url = await this.options.onUpload(file);
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.insert(coordinates?.pos || 0, node);
                                view.dispatch(transaction);
                            } catch (error) {
                                console.error('Image upload failed:', error);
                            }
                        });

                        return true;
                    },
                    handlePaste: (view, event) => {
                        const items = Array.from(event.clipboardData?.items || []);
                        const imageItems = items.filter(item => item.type.startsWith('image/'));

                        if (imageItems.length === 0) return false;

                        event.preventDefault();

                        const { schema } = view.state;
                        const { selection } = view.state;

                        imageItems.forEach((item) => {
                            const file = item.getAsFile();
                            if (!file) return;

                            this.options.onUpload(file).then((url) => {
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            }).catch((error) => {
                                console.error('Image upload failed:', error);
                            });
                        });

                        return true;
                    },
                },
            }),
        ];
    },
});

export const uploadImageToImgur = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_API_ID}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.link;
        } else {
            throw new Error(data.data.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Imgur upload error:', error);
        throw error;
    }
};
