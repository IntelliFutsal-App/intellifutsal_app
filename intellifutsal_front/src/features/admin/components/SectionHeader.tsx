export const SectionHeader = ({ title, tone }: { title: string; tone: "blue" | "green" | "purple" }) => {
    const map = {
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        green: "bg-green-50 border-green-200 text-green-900",
        purple: "bg-purple-50 border-purple-200 text-purple-900",
    } as const;

    return (
        <div className={`border rounded-2xl p-3 ${map[tone]}`}>
            <p className="text-xs font-extrabold uppercase tracking-wide">{title}</p>
        </div>
    );
};