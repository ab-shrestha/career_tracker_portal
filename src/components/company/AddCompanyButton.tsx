
import { Button } from "@/components/ui/button";

interface AddCompanyButtonProps {
  onClick: () => void;
}

export function AddCompanyButton({ onClick }: AddCompanyButtonProps) {
  return (
    <Button onClick={onClick} className="mb-4">
      Add Company
    </Button>
  );
}
