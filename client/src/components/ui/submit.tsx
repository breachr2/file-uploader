import { Spinner } from "./spinner";
import { Button, ButtonProps } from "./button";

type SubmitProps = {
  children: React.ReactNode;
  isLoading: boolean;
} & ButtonProps;

function Submit({ children, isLoading, ...buttonProps }: SubmitProps) {
  if (isLoading) {
    return (
      <Button disabled className="w-20" {...buttonProps}>
        <Spinner size="medium" className="text-white" />
      </Button>
    );
  }

  return (
    <Button className="w-20" type="submit" {...buttonProps}>
      {children}
    </Button>
  );
}

export default Submit;
