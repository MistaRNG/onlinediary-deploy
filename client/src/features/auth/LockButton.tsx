import { Button, Intent } from "@blueprintjs/core";

interface LockButtonProps {
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const LockButton: React.FC<LockButtonProps> = ({ showPassword, toggleShowPassword }) => {
  return (
    <Button
      icon={showPassword ? "unlock" : "lock"}
      intent={Intent.WARNING}
      minimal={true}
      onClick={toggleShowPassword}
    />
  );
};

export default LockButton;
