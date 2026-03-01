export const FutsalSvg = () => {
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 90" preserveAspectRatio="none">
            {/* Outer boundary */}
            <rect x="2" y="2" width="156" height="86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

            {/* Center line */}
            <line x1="80" y1="2" x2="80" y2="88" stroke="white" strokeWidth="0.5" opacity="0.8" />

            {/* Center circle */}
            <circle cx="80" cy="45" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
            <circle cx="80" cy="45" r="0.8" fill="white" opacity="0.8" />

            {/* Left goal area */}
            <path d="M 2 30 L 12 30 L 12 60 L 2 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
            <path d="M 2 38 L 7 38 L 7 52 L 2 52" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

            {/* Right goal area */}
            <path d="M 158 30 L 148 30 L 148 60 L 158 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
            <path d="M 158 38 L 153 38 L 153 52 L 158 52" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

            {/* Penalty spots */}
            <circle cx="15" cy="45" r="0.8" fill="white" opacity="0.8" />
            <circle cx="145" cy="45" r="0.8" fill="white" opacity="0.8" />

            {/* Corner arcs */}
            <path d="M 2 2 Q 4 2 4 4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
            <path d="M 2 88 Q 4 88 4 86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
            <path d="M 158 2 Q 156 2 156 4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
            <path d="M 158 88 Q 156 88 156 86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />

            {/* Substitution zones */}
            <line x1="75" y1="2" x2="75" y2="5" stroke="white" strokeWidth="0.5" opacity="0.6" />
            <line x1="85" y1="2" x2="85" y2="5" stroke="white" strokeWidth="0.5" opacity="0.6" />
        </svg>
    );
};