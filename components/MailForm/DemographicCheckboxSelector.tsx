import React from 'react';
import {
  Pane,
  Heading,
  Checkbox,
  Text,
  Alert,
  majorScale,
  InfoSignIcon,
  Tooltip,
  Badge,
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
const TOTAL_COUNT = UNDERGRAD_COUNT + GRAD_COUNT;

export const DemographicCheckboxSelector: React.FC<
  DemographicCheckboxSelectorProps
> = ({ selection, onChange, disabled = false, showError = false }) => {
  const { includeUndergrads, includeGrads } = selection;

  const estimatedReach =
    (includeUndergrads ? UNDERGRAD_COUNT : 0) +
    (includeGrads ? GRAD_COUNT : 0);

  const noneSelected = !includeUndergrads && !includeGrads;

  const undergradPercentage = ((UNDERGRAD_COUNT / TOTAL_COUNT) * 100).toFixed(
    0
  );
  const gradPercentage = ((GRAD_COUNT / TOTAL_COUNT) * 100).toFixed(0);

  // Color-code based on reach size
  const getReachIntent = () => {
    if (estimatedReach === 0) return 'danger';
    if (estimatedReach < 2000) return 'warning';
    return 'success';
  };

  const getReachBadgeColor = () => {
    if (estimatedReach === 0) return 'red';
    if (estimatedReach < 2000) return 'orange';
    return 'green';
  };

  const ProgressBar = ({ percentage, isActive, color }: any) => (
    <Pane
      display="flex"
      alignItems="center"
      gap={majorScale(1)}
      marginTop={majorScale(1)}
    >
      <Pane
        width="100%"
        height={8}
        background="#E4E7EB"
        borderRadius={4}
        position="relative"
        overflow="hidden"
      >
        <Pane
          height="100%"
          width={isActive ? `${percentage}%` : '0%'}
          background={color}
          borderRadius={4}
          transition="all 0.3s ease-in-out"
        />
      </Pane>
      <Text size={300} color="muted" minWidth={45} textAlign="right">
        {isActive ? `${percentage}%` : '0%'}
      </Text>
    </Pane>
  );

  return (
    <Pane
      background="tint2"
      padding={majorScale(3)}
      borderRadius={8}
      border={noneSelected && showError ? '2px solid #EC4C47' : 'default'}
      marginBottom={majorScale(3)}
    >
      <Pane display="flex" alignItems="center" gap={majorScale(1)} marginBottom={majorScale(2)}>
        <Heading size={600}>🎯 Target Audience</Heading>
        <Tooltip content="Select which student groups should receive your email. Targeted emails reduce inbox overload and improve engagement rates.">
          <InfoSignIcon color="muted" size={14} cursor="help" />
        </Tooltip>
      </Pane>

      {/* Undergrad Checkbox */}
      <Pane
        marginBottom={majorScale(2)}
        padding={majorScale(2)}
        background={includeUndergrads ? 'tint1' : 'transparent'}
        borderRadius={6}
        border={includeUndergrads ? '1px solid #D8E1E8' : '1px solid transparent'}
        transition="all 0.2s ease"
        cursor={disabled ? 'not-allowed' : 'pointer'}
      >
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
        <ProgressBar
          percentage={undergradPercentage}
          isActive={includeUndergrads}
          color="#3366FF"
        />
      </Pane>

      {/* Graduate Checkbox */}
      <Pane
        marginBottom={majorScale(2)}
        padding={majorScale(2)}
        background={includeGrads ? 'tint1' : 'transparent'}
        borderRadius={6}
        border={includeGrads ? '1px solid #D8E1E8' : '1px solid transparent'}
        transition="all 0.2s ease"
        cursor={disabled ? 'not-allowed' : 'pointer'}
      >
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
        <ProgressBar
          percentage={gradPercentage}
          isActive={includeGrads}
          color="#8B5CF6"
        />
      </Pane>

      {/* Estimated Reach Alert */}
      <Alert
        intent={noneSelected && showError ? 'danger' : getReachIntent()}
        marginTop={majorScale(2)}
      >
        {noneSelected && showError ? (
          <>⚠️ Please select at least one audience</>
        ) : (
          <Pane display="flex" alignItems="center" gap={majorScale(1)} flexWrap="wrap">
            <Text>
              📧 Your email will reach approximately{' '}
              <strong>{estimatedReach.toLocaleString()}</strong> students
            </Text>
            <Badge color={getReachBadgeColor()} marginLeft={majorScale(1)}>
              {estimatedReach === 0
                ? 'No audience'
                : estimatedReach < 2000
                ? 'Targeted'
                : 'Broad reach'}
            </Badge>
          </Pane>
        )}
      </Alert>

      {!disabled && !noneSelected && (
        <Text size={300} color="muted" marginTop={majorScale(2)} display="block">
          💡 Tip: Most club events and announcements are relevant to both
          undergrads and grads. Uncheck only if you're certain your message is
          specific to one group.
        </Text>
      )}
    </Pane>
  );
};
