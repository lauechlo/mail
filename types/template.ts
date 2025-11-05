export type TemplateType =
  | 'blank'
  | 'event'
  | 'club_update'
  | 'meeting_notes'
  | 'deadline_reminder'
  | 'newsletter';

export interface EmailTemplate {
  type: TemplateType;
  name: string;
  icon: string;
  subjectTemplate: string;
  bodyTemplate: string;
}
