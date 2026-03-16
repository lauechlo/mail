'use client';

import { useState } from 'react';

import {
    Pane,
    Heading,
    Button,
    TextInputField,
    SelectField,
    TextareaField,
    Alert,
    Spinner,
    majorScale,
    SegmentedControl,
} from 'evergreen-ui';

const CONTENT_TYPES = [
    { label: 'Event', value: 'event' },
    { label: 'Free Food', value: 'freeFood' },
    { label: 'Deadline', value: 'deadline' },
    { label: 'Newsletter', value: 'newsletter' },
];

const CATEGORIES = [
    { label: 'Social Events', value: 'social' },
    { label: 'Academic', value: 'academic' },
    { label: 'Food & Dining', value: 'food' },
    { label: 'Arts & Culture', value: 'arts' },
    { label: 'Sports & Fitness', value: 'sports' },
    { label: 'Career', value: 'career' },
    { label: 'Housing & Sales', value: 'housing' },
    { label: 'Other', value: 'other' },
];

function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            const value = `${h}:${m}`;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            const displayMin = m === '00' ? '' : `:${m}`;
            const label = `${displayHour}${displayMin} ${ampm}`;
            options.push({ value, label });
        }
    }
    return options;
}

const TIME_OPTIONS = generateTimeOptions();

function getDefaultDate(schedule) {
    if (schedule && schedule !== 'now') {
        try {
            const d = new Date(schedule);
            if (!isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            }
        } catch {
            // fall through
        }
    }
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export default function CalendarEventFields({
    emailHeader = '',
    senderName = '',
    senderEmail = '',
    schedule = 'now',
    emailBody = '',
    onEventCreated,
}) {
    const [expanded, setExpanded] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [contentType, setContentType] = useState('event');
    const [title, setTitle] = useState(emailHeader);
    const [date, setDate] = useState(getDefaultDate(schedule));
    const [startTime, setStartTime] = useState('12:00');
    const [endTime, setEndTime] = useState('13:00');
    const [dueTime, setDueTime] = useState('23:59');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('other');
    const [organizer, setOrganizer] = useState(senderName);
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setSubmitting(true);
        setError('');

        const eventData = {
            title: title.trim(),
            description: description.trim() || stripHtml(emailBody),
            date,
            category,
            contentType,
            senderName,
            senderEmail,
            emailContent: emailBody,
            interestedCount: 0,
        };

        if (contentType === 'event' || contentType === 'freeFood') {
            Object.assign(eventData, {
                startTime,
                endTime,
                location: location.trim(),
            });
        }

        if (contentType === 'event') {
            Object.assign(eventData, { organizer: organizer.trim() });
        }

        if (contentType === 'deadline') {
            Object.assign(eventData, { dueTime });
        }

        if (contentType === 'freeFood') {
            Object.assign(eventData, { hasFreeFood: true, expiresIn: 60 });
        }

        try {
            const response = await fetch('/api/hoagie/calendar/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to create calendar event');
            }

            const created = await response.json();
            setSubmitted(true);
            if (onEventCreated) onEventCreated(created);
        } catch (err) {
            setError(
                'Could not add to calendar. You can try again or add it manually on Hoagie Calendar.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <Pane
                background='tint1'
                borderRadius={8}
                padding={majorScale(3)}
                marginTop={majorScale(3)}
                maxWidth={500}
                width='100%'
            >
                <Alert intent='success' title='Added to Hoagie Calendar!'>
                    Your event is now visible on Hoagie Calendar. Students can
                    save it, RSVP, and get reminders.
                </Alert>
            </Pane>
        );
    }

    if (!expanded) {
        return (
            <Pane
                background='tint1'
                borderRadius={8}
                padding={majorScale(3)}
                marginTop={majorScale(3)}
                maxWidth={500}
                width='100%'
                textAlign='center'
            >
                <Heading size={500} marginBottom={majorScale(1)}>
                    Want to add this to Hoagie Calendar?
                </Heading>
                <Pane marginBottom={majorScale(2)} color='muted'>
                    Your email will also appear as an event so students can save
                    it and get reminders.
                </Pane>
                <Button
                    appearance='primary'
                    onClick={() => setExpanded(true)}
                >
                    Yes, add to calendar
                </Button>
            </Pane>
        );
    }

    const showTimeFields =
        contentType === 'event' || contentType === 'freeFood';
    const showLocation = contentType !== 'newsletter';
    const showOrganizer = contentType === 'event';
    const showDueTime = contentType === 'deadline';

    const isValid = (() => {
        if (!title.trim()) return false;
        if (contentType === 'event' && endTime <= startTime) return false;
        if (
            (contentType === 'event' || contentType === 'freeFood') &&
            !location.trim()
        )
            return false;
        if (contentType === 'event' && !organizer.trim()) return false;
        return true;
    })();

    return (
        <Pane
            background='tint1'
            borderRadius={8}
            padding={majorScale(3)}
            marginTop={majorScale(3)}
            maxWidth={500}
            width='100%'
        >
            <Heading size={500} marginBottom={majorScale(2)}>
                Add to Hoagie Calendar
            </Heading>

            {error && (
                <Alert intent='danger' title={error} marginBottom={majorScale(2)}>
                    <Button
                        appearance='minimal'
                        size='small'
                        onClick={() => {
                            setError('');
                            handleSubmit();
                        }}
                    >
                        Try again
                    </Button>
                </Alert>
            )}

            <Pane marginBottom={majorScale(2)}>
                <Pane marginBottom={4} fontWeight={500} fontSize={14}>
                    Type
                </Pane>
                <SegmentedControl
                    options={CONTENT_TYPES}
                    value={contentType}
                    onChange={(value) => setContentType(value)}
                />
            </Pane>

            <TextInputField
                label='Event Title'
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Club Meeting or Guest Speaker'
            />

            <TextInputField
                label='Date'
                required
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {showTimeFields && (
                <Pane display='flex' gap={majorScale(2)}>
                    <SelectField
                        label='Start Time'
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        flex={1}
                    >
                        {TIME_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </SelectField>
                    <SelectField
                        label='End Time'
                        required={contentType === 'event'}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        flex={1}
                        isInvalid={
                            contentType === 'event' && endTime <= startTime
                        }
                        validationMessage={
                            contentType === 'event' && endTime <= startTime
                                ? 'Must be after start'
                                : null
                        }
                    >
                        {TIME_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </SelectField>
                </Pane>
            )}

            {showDueTime && (
                <SelectField
                    label='Due Time'
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                >
                    {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </SelectField>
            )}

            <SelectField
                label='Category'
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                        {c.label}
                    </option>
                ))}
            </SelectField>

            {showLocation && (
                <TextInputField
                    label='Location'
                    required={
                        contentType === 'event' || contentType === 'freeFood'
                    }
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='e.g., Frist Campus Center, Room 302'
                />
            )}

            {showOrganizer && (
                <TextInputField
                    label='Organizer / Club'
                    required
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder='e.g., Princeton Coding Club'
                />
            )}

            <TextareaField
                label='Description (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Additional details (leave blank to use your email body)'
                rows={2}
            />

            <Pane display='flex' gap={majorScale(2)} justifyContent='flex-end'>
                <Button onClick={() => setExpanded(false)}>Skip</Button>
                <Button
                    appearance='primary'
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    iconBefore={submitting ? <Spinner size={16} /> : undefined}
                >
                    {submitting ? 'Adding...' : 'Add to Calendar'}
                </Button>
            </Pane>
        </Pane>
    );
}

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);
}
