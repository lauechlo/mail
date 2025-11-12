import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Pane, Text, majorScale } from 'evergreen-ui';

export const SlashCommandsList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    if (props.items.length === 0) {
        return null;
    }

    return (
        <Pane
            background="white"
            border="default"
            borderRadius={8}
            boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1)"
            maxHeight={400}
            overflow="auto"
            padding={majorScale(1)}
            minWidth={300}
        >
            {props.items.map((item: any, index: number) => (
                <Pane
                    key={index}
                    background={index === selectedIndex ? 'tint2' : 'white'}
                    padding={majorScale(1)}
                    borderRadius={4}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    gap={majorScale(1)}
                    marginBottom={majorScale(1)}
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <Text fontSize={20}>{item.icon}</Text>
                    <Pane flex={1}>
                        <Text display="block" fontWeight={600} size={400}>
                            {item.title}
                        </Text>
                        <Text display="block" color="muted" size={300}>
                            {item.description}
                        </Text>
                    </Pane>
                </Pane>
            ))}
        </Pane>
    );
});

SlashCommandsList.displayName = 'SlashCommandsList';
