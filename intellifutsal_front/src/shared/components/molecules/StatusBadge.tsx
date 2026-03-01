import { Badge } from "../atoms";

export const StatusBadge = ({ status }: { status: boolean }) => (
    <Badge variant={status ? "success" : "secondary"}>
        {status ? "Activo" : "Inactivo"}
    </Badge>
);