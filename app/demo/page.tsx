'use client';

import { useState } from 'react';
import {
    Pane,
    Heading,
    majorScale,
    Button,
    TextInputField,
    Dialog,
    Text,
    InfoSignIcon,
    Alert,
} from 'evergreen-ui';
import { DemographicSelector } from '@/components/MailForm/DemographicSelector';
import { TemplateSelector } from '@/components/MailForm/TemplateSelector';
import RichTextEditor from '@/components/RichSunEditor';
import ScheduleSelectField from '@/components/MailForm/ScheduledSend/ScheduleSelectField';
import { DemographicOption, DEMOGRAPHIC_OPTIONS } from '@/types/demographic';
import { TemplateType } from '@/types/template';
import { EMAIL_TEMPLATES } from '@/constants/emailTemplates';

const senderNameDesc = `This is the name of the sender displayed in the email.
You can either keep it as your name or use the name of your club, department, or
organization if you have permission to do so. Your full name will be included in the
footer of the email regardless of your sender name.`;

export default function DemoPage() {
    const [header, setHeader] = useState('');
    const [sender, setSender] = useState('Chloe Lau');
    const [body, setBody] = useState('');
    const [schedule, setSchedule] = useState('now');
    const [showConfirm, setShowConfirm] = useState(false);
    const [targetDemographic, setTargetDemographic] = useState<DemographicOption>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('blank');

    const handleTemplateSelect = (type: TemplateType) => {
        setSelectedTemplate(type);
        const template = EMAIL_TEMPLATES.find((t) => t.type === type);
        if (template) {
            if (template.subjectTemplate) {
                setHeader(template.subjectTemplate);
            }
            setBody(template.bodyTemplate);
        }
    };

    const getDemographicConfirmationText = () => {
        switch (targetDemographic) {
            case 'undergraduates':
                return 'You are about to send an email to all undergraduates at Princeton.';
            case 'graduates':
                return 'You are about to send an email to all graduate students at Princeton.';
            case 'all':
            default:
                return 'You are about to send an email to everyone at Princeton.';
        }
    };

    const getDemographicTargetText = () => {
        switch (targetDemographic) {
            case 'undergraduates':
                return 'undergraduate residential college listservs';
            case 'graduates':
                return 'graduate residential college listservs';
            case 'all':
            default:
                return 'all residential college listservs';
        }
    };

    return (
        <Pane maxWidth={900} marginX="auto" padding={majorScale(4)}>
            <Pane
                background="tint1"
                padding={majorScale(2)}
                marginBottom={majorScale(3)}
                borderRadius={8}
            >
                <Heading size={600}>📸 Demo Mode - For Figma Screenshots</Heading>
                <Text>
                    This is a demo page showing the new features without requiring
                    authentication. Perfect for taking screenshots!
                </Text>
            </Pane>

            <Pane>
                <Pane display="flex" justifyContent="space-between">
                    <Heading size={800} marginY={majorScale(2)}>
                        Send an Email
                    </Heading>
                    <Button
                        size="large"
                        appearance="default"
                        marginY={majorScale(2)}
                    >
                        Scheduled Emails
                    </Button>
                </Pane>

                <DemographicSelector
                    value={targetDemographic}
                    onChange={setTargetDemographic}
                />

                <ScheduleSelectField
                    label="Scheduled Time"
                    description="Send emails now or schedule them up to four days
                    in advance! Emails will be sent out in batches at 8am,
                    1pm, and 6pm EST. You may only schedule one email per time slot."
                    required
                    includeNow
                    schedule={schedule}
                    handleScheduleChange={(e) => setSchedule(e.target.value)}
                />

                <TextInputField
                    label="Email Header"
                    required
                    description="This is the title of the email to the listservs."
                    placeholder="Hi from Hoagie!"
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                />

                <TextInputField
                    label="Displayed Sender Name"
                    required
                    description={senderNameDesc}
                    placeholder="Your name or organization"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                />

                <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={handleTemplateSelect}
                />

                <RichTextEditor
                    onChange={(content) => setBody(content)}
                    onError={(error) => console.log(error)}
                    label="Body Content"
                    required
                    placeholder="Hello there!"
                    description="This is the content of your email."
                    value={body}
                />

                <Pane>
                    <Button
                        onClick={() => setShowConfirm(true)}
                        size="large"
                        appearance="primary"
                        float="right"
                    >
                        Send Email
                    </Button>
                    <Button
                        size="large"
                        appearance="secondary"
                        float="right"
                        marginRight="8px"
                    >
                        Send Test Email
                    </Button>
                    <Button size="large" float="left">
                        Back
                    </Button>
                </Pane>

                <Dialog
                    isShown={showConfirm}
                    hasHeader={false}
                    hasClose={false}
                    onConfirm={() => {
                        alert('Demo mode - email not actually sent!');
                        setShowConfirm(false);
                    }}
                    onCloseComplete={() => setShowConfirm(false)}
                    confirmLabel="Send Email"
                    intent="warning"
                >
                    <Pane
                        marginTop={35}
                        marginBottom={20}
                        display="flex"
                        alignItems="center"
                    >
                        <InfoSignIcon marginRight={10} />
                        {getDemographicConfirmationText()}
                    </Pane>
                    <Text>
                        Once you click <b>Send Email</b>, Hoagie will send the email
                        to <b>{getDemographicTargetText()} on your behalf</b>. Your
                        name and NetID will be included at the bottom of the email
                        regardless of the content.
                    </Text>
                    <Alert
                        intent="warning"
                        title="Use responsibly. Do not use this tool for personal messages."
                        marginTop={20}
                    >
                        Hoagie Mail sends out emails instantly, but if the tool is
                        used to send offensive, intentionally misleading or harmful
                        emails, the user will be banned from the platform and, if
                        necessary, reported to the University.
                    </Alert>
                </Dialog>
            </Pane>
        </Pane>
    );
}
