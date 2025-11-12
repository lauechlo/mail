import { useState } from 'react';
import { Pane, Button, Heading, Text, majorScale, TabNavigation, Tab } from 'evergreen-ui';

interface EmailPreviewProps {
    content: string;
    subject: string;
    sender: string;
}

type ViewMode = 'desktop' | 'mobile';

export const EmailPreview = ({ content, subject, sender }: EmailPreviewProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');

    const previewWidth = viewMode === 'desktop' ? '100%' : '375px';
    const previewMaxWidth = viewMode === 'desktop' ? '800px' : '375px';

    return (
        <Pane>
            <Pane
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={majorScale(2)}
            >
                <Heading size={600}>Email Preview</Heading>
                <Pane display="flex" gap={majorScale(1)}>
                    <Button
                        onClick={() => setViewMode('desktop')}
                        appearance={viewMode === 'desktop' ? 'primary' : 'default'}
                    >
                        🖥️ Desktop
                    </Button>
                    <Button
                        onClick={() => setViewMode('mobile')}
                        appearance={viewMode === 'mobile' ? 'primary' : 'default'}
                    >
                        📱 Mobile
                    </Button>
                </Pane>
            </Pane>

            <Pane
                border="default"
                borderRadius={8}
                background="tint1"
                padding={majorScale(3)}
                display="flex"
                justifyContent="center"
            >
                <Pane
                    background="white"
                    border="default"
                    borderRadius={8}
                    width={previewWidth}
                    maxWidth={previewMaxWidth}
                    boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    overflow="hidden"
                    transition="all 0.3s"
                >
                    {/* Email Header */}
                    <Pane
                        background="tint2"
                        padding={majorScale(2)}
                        borderBottom="default"
                    >
                        <Text size={300} color="muted" display="block" marginBottom={4}>
                            From: <strong>{sender}</strong>
                        </Text>
                        <Heading size={500}>{subject || '(No subject)'}</Heading>
                    </Pane>

                    {/* Email Body */}
                    <Pane
                        padding={majorScale(3)}
                        className="email-preview-content"
                        dangerouslySetInnerHTML={{ __html: content || '<p style="color: #999;">Start typing to see preview...</p>' }}
                    />

                    {/* Email Footer */}
                    <Pane
                        background="tint2"
                        padding={majorScale(2)}
                        borderTop="default"
                    >
                        <Text size={300} color="muted">
                            Sent via Hoagie Mail
                        </Text>
                    </Pane>
                </Pane>
            </Pane>
        </Pane>
    );
};
