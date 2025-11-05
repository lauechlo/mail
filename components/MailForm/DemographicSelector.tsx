import React from 'react';
import {
  FormField,
  SelectField,
  Text,
  Pane,
  Badge,
  majorScale,
} from 'evergreen-ui';
import { DemographicOption, DEMOGRAPHIC_OPTIONS } from '../../types/demographic';

interface DemographicSelectorProps {
  value: DemographicOption;
  onChange: (value: DemographicOption) => void;
  disabled?: boolean;
}

export const DemographicSelector: React.FC<DemographicSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const selectedOption = DEMOGRAPHIC_OPTIONS.find((opt) => opt.value === value);

  return (
    <Pane
      background="tint2"
      padding={majorScale(3)}
      borderRadius={8}
      border="2px solid #FF6900"
      position="relative"
      marginBottom={majorScale(3)}
    >
      {/* NEW FEATURE Badge */}
      <Badge
        color="orange"
        position="absolute"
        top={-10}
        left={20}
        paddingX={12}
        paddingY={4}
        fontSize={11}
        fontWeight={600}
      >
        NEW FEATURE
      </Badge>

      <FormField marginBottom={0}>
        <SelectField
          label="Send to"
          required
          description={selectedOption?.description}
          value={value}
          onChange={(e) => onChange(e.target.value as DemographicOption)}
          disabled={disabled}
        >
          {DEMOGRAPHIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <Pane
          display="flex"
          gap={majorScale(1)}
          marginTop={majorScale(2)}
          flexWrap="wrap"
        >
          <Badge color="blue">📊 Targeted Distribution</Badge>
          <Badge color="green">🎯 Better Engagement</Badge>
          <Badge color="purple">📧 Reduced Email Fatigue</Badge>
        </Pane>

        <Text size={300} color="muted" marginTop={majorScale(2)} display="block">
          Select your target audience to ensure your email reaches the right
          recipients. This helps reduce email overload and improves
          communication effectiveness.
        </Text>
      </FormField>
    </Pane>
  );
};
