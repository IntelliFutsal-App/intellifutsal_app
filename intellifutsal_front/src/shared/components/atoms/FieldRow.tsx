export const FieldRow = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);