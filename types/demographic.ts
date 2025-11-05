export type DemographicOption = 'all' | 'undergraduates' | 'graduates';

export interface DemographicInfo {
  value: DemographicOption;
  label: string;
  description: string;
}

export const DEMOGRAPHIC_OPTIONS: DemographicInfo[] = [
  {
    value: 'all',
    label: 'All Residential College Listservs',
    description: 'Send to all undergraduate and graduate students',
  },
  {
    value: 'undergraduates',
    label: 'Undergraduates Only',
    description: 'Send to undergraduate students only',
  },
  {
    value: 'graduates',
    label: 'Graduates Only',
    description: 'Send to graduate students only',
  },
];
