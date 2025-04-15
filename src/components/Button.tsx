import Button, { ButtonProps } from '@mui/material/Button';



interface CustomButtonProps extends ButtonProps {
  name: string
}

export default function CustomButton({ name, ...buttonProps }: CustomButtonProps) {
  return (
    <Button {...buttonProps}>{name}</Button>
  );
}
