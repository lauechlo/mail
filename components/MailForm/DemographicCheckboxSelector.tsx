import React from 'react';
import {
  Pane,
  Heading,
  Checkbox,
  Text,
  Alert,
  majorScale,
} from 'evergreen-ui';

export interface DemographicSelection {
  includeUndergrads: boolean;
  includeGrads: boolean;
}

interface DemographicCheckboxSelectorProps {
  selection: DemographicSelection;
  onChange: (selection: DemographicSelection) => void;
  disabled?: boolean;
  showError?: boolean;
}

const UNDERGRAD_COUNT = 4500;
const GRAD_COUNT = 1200;

export const DemographicCheckboxSelector: React.FC<
  DemographicCheckboxSelectorProps
> = ({ selection, onChange, disabled = false, showError = false }) => {
  const { includeUndergrads, includeGrads } = selection;

  const estimatedReach =
    (includeUndergrads ? UNDERGRAD_COUNT : 0) +
    (includeGrads ? GRAD_COUNT : 0);

  const noneSelected = !includeUndergrads && !includeGrads;

  return (
    <Pane
      background="tint2"
      padding={majorScale(3)}
      borderRadius={8}
      border={noneSelected && showError ? '2px solid #EC4C47' : 'default'}
      marginBottom={majorScale(3)}
    >
      <Heading size={600} marginBottom={majorScale(2)}>
        🎯 Target Audience
      </Heading>

      <Pane marginBottom={majorScale(2)}>
        <Checkbox
          label={
            <Pane>
              <Text size={500} fontWeight={600}>
                Undergraduate Residential Colleges
              </Text>
              <Text size={300} color="muted" display="block" marginTop={2}>
                Butler, Forbes, Mathey, Rockefeller, Whitman, Wilson, Yeh,
                First, New, Hobson (~{UNDERGRAD_COUNT.toLocaleString()}{' '}
                students)
              </Text>
            </Pane>
          }
          checked={includeUndergrads}
          onChange={(e) =>
            onChange({
              ...selection,
              includeUndergrads: e.target.checked,
            })
          }
          disabled={disabled}
        />
      </Pane>

      <Pane marginBottom={majorScale(2)}>
        <Checkbox
          label={
            <Pane>
              <Text size={500} fontWeight={600}>
                Graduate Residential Colleges
              </Text>
              <Text size={300} color="muted" display="block" marginTop={2}>
                GCR, Lakeside, Wyman House (~{GRAD_COUNT.toLocaleString()}{' '}
                students)
              </Text>
            </Pane>
          }
          checked={includeGrads}
          onChange={(e) =>
            onChange({
              ...selection,
              includeGrads: e.target.checked,
            })
          }
          disabled={disabled}
        />
      </Pane>

      <Alert
        intent={noneSelected && showError ? 'danger' : 'none'}
        marginTop={majorScale(2)}
      >
        {noneSelected && showError ? (
          <>⚠️ Please select at least one audience</>
        ) : (
          <>
            📧 Your email will reach approximately{' '}
            <strong>{estimatedReach.toLocaleString()}</strong> students
          </>
        )}
      </Alert>

      {!disabled && (
        <Text size={300} color="muted" marginTop={majorScale(2)} display="block">
          💡 Tip: Most club events and announcements are relevant to both
          undergrads and grads. Uncheck only if you're certain your message is
          specific to one group.
        </Text>
      )}
    </Pane>
  );
};
