export const DateMutation = (dateString: string): string => {
    const MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Parse the ISO string to a Date object
    const date = new Date(dateString);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const getDaySuffix = (day: number) => {
        if (day === 1 || day === 21 || day === 31) return 'st';
        if (day === 2 || day === 22) return 'nd';
        if (day === 3 || day === 23) return 'rd';
        return 'th';
    };

    return `${MONTHS[monthIndex]} ${day}${getDaySuffix(day)}, ${year}`;
};
