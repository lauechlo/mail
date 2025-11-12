import React from 'react';
import { Pane, Heading, Text, majorScale } from 'evergreen-ui';
import { TemplateType } from '../../types/template';
import { EMAIL_TEMPLATES } from '../../constants/emailTemplates';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (type: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <Pane
      background="tint1"
      borderRadius={8}
      padding={majorScale(2)}
      marginBottom={majorScale(2)}
      border="default"
    >
      {/* Header */}
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={majorScale(2)}
      >
        <Heading size={400}>✨ Start with a template</Heading>
      </Pane>

      {/* Template Grid */}
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
        gap={majorScale(2)}
      >
        {EMAIL_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.type}
            template={template}
            isSelected={selectedTemplate === template.type}
            onSelect={() => onSelectTemplate(template.type)}
          />
        ))}
      </Pane>
    </Pane>
  );
};

interface TemplateCardProps {
  template: (typeof EMAIL_TEMPLATES)[number];
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  return (
    <Pane
      textAlign="center"
      cursor="pointer"
      onClick={onSelect}
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      {/* Preview Box */}
      <Pane
        background={template.type === 'blank' ? 'orangeTint' : 'white'}
        border={isSelected ? '2px solid #FF6900' : '2px solid #E4E7EB'}
        borderRadius={8}
        height={80}
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginBottom={majorScale(1)}
        boxShadow={isSelected ? '0 0 0 3px rgba(255, 105, 0, 0.1)' : undefined}
        transition="all 0.2s"
        _hover={{ borderColor: '#FF6900' }}
        position="relative"
        overflow="hidden"
      >
        {template.type === 'blank' ? (
          <Text fontSize={24}>{template.icon}</Text>
        ) : (
          <TemplateMiniPreview type={template.type} icon={template.icon} />
        )}
      </Pane>

      {/* Template Name */}
      <Text
        size={300}
        fontWeight={isSelected ? 600 : 500}
        color={isSelected ? 'orange' : 'default'}
      >
        {template.name}
      </Text>
    </Pane>
  );
};

interface TemplateMiniPreviewProps {
  type: TemplateType;
  icon: string;
}

const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({
  type,
  icon,
}) => {
  const renderPreview = () => {
    switch (type) {
      case 'event':
        return (
          <Pane padding={10} width="100%">
            <Pane height={4} background="#E4E7EB" borderRadius={2} />
            <Pane
              height={4}
              background="#E4E7EB"
              borderRadius={2}
              width="60%"
              marginTop={4}
            />
            <Pane
              height={20}
              background="#E8F4FD"
              borderRadius={4}
              marginTop={6}
            />
            <Pane height={4} background="#E4E7EB" borderRadius={2} marginTop={4} />
          </Pane>
        );
      case 'club_update':
        return (
          <Pane padding={10} width="100%">
            <Pane
              height={4}
              background="#E4E7EB"
              borderRadius={2}
              width="60%"
            />
            <Pane height={4} background="#E4E7EB" borderRadius={2} marginTop={4} />
            <Pane height={4} background="#E4E7EB" borderRadius={2} marginTop={4} />
          </Pane>
        );
      case 'meeting_notes':
        return (
          <Pane padding={10} width="100%">
            <Pane
              height={4}
              background="#E4E7EB"
              borderRadius={2}
              width="60%"
            />
            <Pane display="flex" alignItems="center" marginTop={4}>
              <Pane
                width={3}
                height={3}
                background="#999"
                borderRadius="50%"
                marginRight={4}
              />
              <Pane height={3} background="#E4E7EB" borderRadius={2} flex={1} />
            </Pane>
            <Pane display="flex" alignItems="center" marginTop={3}>
              <Pane
                width={3}
                height={3}
                background="#999"
                borderRadius="50%"
                marginRight={4}
              />
              <Pane height={3} background="#E4E7EB" borderRadius={2} flex={1} />
            </Pane>
            <Pane display="flex" alignItems="center" marginTop={3}>
              <Pane
                width={3}
                height={3}
                background="#999"
                borderRadius="50%"
                marginRight={4}
              />
              <Pane height={3} background="#E4E7EB" borderRadius={2} flex={1} />
            </Pane>
          </Pane>
        );
      case 'deadline_reminder':
        return (
          <Pane padding={10} width="100%">
            <Pane height={4} background="#E4E7EB" borderRadius={2} />
            <Pane
              height={14}
              background="#FFF3CD"
              borderRadius={4}
              marginTop={6}
            />
            <Pane
              height={4}
              background="#E4E7EB"
              borderRadius={2}
              width="60%"
              marginTop={4}
            />
          </Pane>
        );
      case 'newsletter':
        return (
          <Pane padding={10} width="100%">
            <Pane
              height={16}
              background="linear-gradient(90deg, #FF6900 0%, #FFA200 100%)"
              borderRadius={4}
            />
            <Pane height={4} background="#E4E7EB" borderRadius={2} marginTop={6} />
            <Pane
              height={4}
              background="#E4E7EB"
              borderRadius={2}
              width="60%"
              marginTop={4}
            />
          </Pane>
        );
      default:
        return <Text fontSize={20}>{icon}</Text>;
    }
  };

  return renderPreview();
};
