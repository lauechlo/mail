import React from 'react';
import {
  FormField,
  Text,
  Pane,
  Badge,
  majorScale,
  Checkbox,
  Label,
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
        <Label htmlFor="demographic-options" marginBottom={majorScale(1)} display="block">
          Send to
        </Label>

        <Pane display="flex" flexDirection="column" gap={majorScale(2)} marginTop={majorScale(2)}>
          {DEMOGRAPHIC_OPTIONS.map((option) => (
            <Pane key={option.value}>
              <Checkbox
                label={option.label}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={disabled}
              />
              <Text size={300} color="muted" marginLeft={majorScale(3)} display="block">
                {option.description}
              </Text>
            </Pane>
          ))}
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
