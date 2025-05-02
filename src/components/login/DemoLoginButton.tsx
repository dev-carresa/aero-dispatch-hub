
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DemoLoginButtonProps {
  onClick: () => Promise<void>;
  isButtonDisabled: boolean;
}

export const DemoLoginButton = ({ onClick, isButtonDisabled }: DemoLoginButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="w-full mt-4"
      disabled={isButtonDisabled}
    >
      {isButtonDisabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion en cours...
        </>
      ) : (
        "Démo (connexion rapide)"
      )}
    </Button>
  );
};
