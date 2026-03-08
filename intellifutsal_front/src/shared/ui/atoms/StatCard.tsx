interface StatCardProps {
    value: string;
    label: string;
    sublabel: string;
}

export const StatCard = ({ value, label, sublabel }: StatCardProps) => {
    return (
        <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-8 shadow-xl shadow-orange-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/30">
            <div className="text-5xl font-bold mb-3">{value}</div>
            <div className="text-orange-50 font-semibold text-lg">{label}</div>
            <div className="text-sm text-orange-100 mt-2">{sublabel}</div>
        </div>
    );
};