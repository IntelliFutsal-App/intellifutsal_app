import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../atoms";

interface ShowInactiveToggleProps {
    show: boolean;
    onChange: (show: boolean) => void;
}

export const ShowInactiveToggle = ({ show, onChange }: ShowInactiveToggleProps) => (
    <Button
        onClick={() => onChange(!show)}
        variant="secondary"
        className={`${
            show
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
        icon={show ? FaEye : FaEyeSlash}
        iconPosition="left"
    >
        {show ? "Ocultar inactivos" : "Mostrar inactivos"}
    </Button>
);