
import { Button } from "@/components/ui/button";

interface CompanyFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export function CompanyFormActions({ isEditing, onCancel }: CompanyFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{isEditing ? "Update" : "Add"} Company</Button>
    </div>
  );
}
