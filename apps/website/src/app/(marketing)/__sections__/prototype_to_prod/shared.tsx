import { Box } from '@mui/material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardProps,
  Link,
  Typography,
} from '@palico-ai/components';

export type ComponentCardProps = CardProps;

export const ComponentCard: React.FC<ComponentCardProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export interface ComponentCardWithDescriptionProps extends ComponentCardProps {
  title: string;
  descriptions: string[];
  action?: {
    label: string;
    link: string;
  };
}

export const ComponentCardWithDescription: React.FC<
  ComponentCardWithDescriptionProps
> = ({ title, descriptions, action, ...props }) => {
  return (
    <ComponentCard {...props}>
      <CardHeader
        title={title}
        action={
          action && (
            <Link href={action.link}>
              <Button variant="outlined" color="secondary" size="small">
                {action.label}
              </Button>
            </Link>
          )
        }
      />
      <CardContent>
        {descriptions.map((description, index) => (
          <Typography key={index} variant="body2">
            {description}
          </Typography>
        ))}
      </CardContent>
    </ComponentCard>
  );
};

export interface ComponentCardWithDescriptionAndImageProps
  extends ComponentCardWithDescriptionProps {
  image: string;
}

export const ComponentCardWithDescriptionAndImage: React.FC<
  ComponentCardWithDescriptionAndImageProps
> = ({ image, ...props }) => {
  return (
    <ComponentCard {...props}>
      <CardHeader title={props.title} />
      <CardContent>
        <Box mb={2}>
          {props.descriptions.map((description, index) => (
            <Typography key={index} variant="body2">
              {description}
            </Typography>
          ))}
        </Box>
        <CardMedia
          component="img"
          image={image}
          sx={{ width: '100%', maxHeight: 240 }}
        />
      </CardContent>
    </ComponentCard>
  );
};
