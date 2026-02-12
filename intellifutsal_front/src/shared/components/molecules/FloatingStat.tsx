interface FloatingStatProps {
    label: string;
    value: string;
    delay?: string;
}

export const FloatingStat = ({ label, value, delay = "0s" }: FloatingStatProps) => {
    return (
        <div
            className="bg-orange-600 text-white p-3 rounded-xl shadow-lg animate-bounce"
            style={{ animationDelay: delay }}
        >
            <div className="text-xs font-medium">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
};