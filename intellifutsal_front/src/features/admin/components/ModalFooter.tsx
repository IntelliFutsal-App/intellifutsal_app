import { Button } from "@shared/components";

export const ModalFooter = ({
    onCancel,
    cancelText = "Cancelar",
    submitText,
    isLoading,
}: {
    onCancel: () => void;
    cancelText?: string;
    submitText: string;
    isLoading?: boolean;
}) => (
    <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isLoading}>
            {cancelText}
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading}>
            {submitText}
        </Button>
    </div>
);