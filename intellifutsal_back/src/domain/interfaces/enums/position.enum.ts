export enum Position {
    GOALKEEPER = "GOALKEEPER",
    FIXO = "FIXO",
    WINGER = "WINGER",
    PIVOT = "PIVOT"
}

export const stringToPosition = (value: string): Position => {
    const upperValue = value.toUpperCase();
    if (upperValue in Position) return Position[upperValue as keyof typeof Position];
    
    const position = Object.values(Position).find(position => position === upperValue);
    if (position) return position;

    throw new Error(`Invalid position: ${value}. Valid positions are: ${Object.values(Position).join(", ")}`);
}