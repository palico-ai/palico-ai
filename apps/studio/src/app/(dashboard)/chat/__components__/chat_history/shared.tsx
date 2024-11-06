import { Box, Chip, Divider } from '@mui/material';
import { ComponentWithChildren, Typography } from '@palico-ai/components';

export interface ChatListItemDataDisplayProps extends ComponentWithChildren {
  title: string;
}

export const ChatListItemDataDisplay: React.FC<
  ChatListItemDataDisplayProps
> = ({ title, children }) => {
  return (
    <Box>
      <Divider>
        <Typography variant="overline">{title}</Typography>
      </Divider>
      <Box>{children}</Box>
    </Box>
  );
};

export interface ChatListItemWrapperProps extends ComponentWithChildren {
  label: string;
  itemRef?: React.Ref<unknown> | undefined;
  align: 'flex-start' | 'flex-end';
}

export const ChatListItemWrapper: React.FC<ChatListItemWrapperProps> = ({
  label,
  itemRef,
  align,
  children,
}) => {
  return (
    <Box
      ref={itemRef}
      sx={{
        borderRadius: 2,
        mb: 1,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          // flexDirection: 'row',
          // alignItems: 'flex-start',
          maxWidth: '70%',
        }}
      >
        <Box
          sx={{
            alignSelf: align,
          }}
        >
          <Chip
            sx={{
              borderRadius: 2,
            }}
            label={label}
            variant="filled"
          />
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
