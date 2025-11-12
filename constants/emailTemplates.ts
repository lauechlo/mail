import { EmailTemplate } from '../types/template';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    type: 'blank',
    name: 'Blank',
    icon: '📝',
    subjectTemplate: '',
    bodyTemplate: '',
  },
  {
    type: 'event',
    name: 'Event Invite',
    icon: '🎉',
    subjectTemplate: "You're Invited! [Event Name]",
    bodyTemplate: `<h1>You're Invited! 🎉</h1>
<div class="event-block" style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
<h3>📅 [Event Name]</h3>
<p><strong>Date:</strong> [Add date]</p>
<p><strong>Time:</strong> [Add time]</p>
<p><strong>Location:</strong> [Add location]</p>
<p><strong>RSVP:</strong> [Add link]</p>
</div>
<p>Join us for [brief description of the event]. This is a great opportunity to [key benefit/purpose].</p>
<div style="text-align: center; margin: 24px 0;">
<a href="#" style="display: inline-block; background: #FF6900; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">RSVP Now</a>
</div>
<p>Hope to see you there!</p>`,
  },
  {
    type: 'club_update',
    name: 'Club Update',
    icon: '📢',
    subjectTemplate: '[Club Name] Update',
    bodyTemplate: `<p><strong>📢 [Club Name] Update</strong></p>
<p>Hi everyone!</p>
<p>Here's what's happening this week:</p>
<p><strong>Upcoming Events:</strong><br>
• [Event 1]<br>
• [Event 2]</p>
<p><strong>Important Announcements:</strong><br>
[Your announcements here]</p>
<p><strong>Get Involved:</strong><br>
[Opportunities or action items]</p>
<p>Questions? Reply to this email or visit [website/contact].</p>`,
  },
  {
    type: 'meeting_notes',
    name: 'Meeting Notes',
    icon: '📋',
    subjectTemplate: 'Meeting Notes - [Date]',
    bodyTemplate: `<p><strong>Meeting Notes - [Date]</strong></p>
<p><strong>Attendees:</strong> [List attendees]</p>
<p><strong>Key Discussion Points:</strong><br>
• [Point 1]<br>
• [Point 2]<br>
• [Point 3]</p>
<p><strong>Action Items:</strong><br>
□ [Task 1] - Assigned to: [Name]<br>
□ [Task 2] - Assigned to: [Name]</p>
<p><strong>Next Meeting:</strong> [Date and time]</p>`,
  },
  {
    type: 'deadline_reminder',
    name: 'Reminder',
    icon: '⏰',
    subjectTemplate: 'Reminder: [Subject]',
    bodyTemplate: `<h2>⏰ Reminder: [Subject]</h2>
<p>Hi everyone,</p>
<p>This is a friendly reminder that <strong>[deadline/event]</strong> is coming up on <strong>[date]</strong>.</p>
<div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 16px 0; border-radius: 4px;">
<p style="margin: 0;"><strong>⏰ Deadline:</strong> [Add date and details]</p>
</div>
<p>Please make sure to [action required].</p>
<p>If you have any questions, please reach out to [contact].</p>`,
  },
  {
    type: 'newsletter',
    name: 'Newsletter',
    icon: '📰',
    subjectTemplate: '[Newsletter Name] - Issue #[Number]',
    bodyTemplate: `<div style="background: linear-gradient(90deg, #FF6900 0%, #FFA200 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
<h2 style="margin: 0; font-size: 24px;">📰 [Newsletter Name]</h2>
<p style="margin: 5px 0 0 0; opacity: 0.9;">Issue #[Number] - [Date]</p>
</div>
<div style="padding: 20px;">
<p><strong>This Week's Highlights</strong></p>
<p><strong>🎯 Featured Story</strong><br>
[Your main story here]</p>
<p><strong>📅 Upcoming Events</strong><br>
• [Event 1]<br>
• [Event 2]</p>
<p><strong>🏆 Member Spotlight</strong><br>
[Recognition or feature]</p>
<p><strong>📢 Announcements</strong><br>
[Important updates]</p>
<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
<p><em>Thanks for reading! See you next week.</em></p>
</div>`,
  },
];
