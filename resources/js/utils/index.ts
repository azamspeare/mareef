export const calculateTime = (time: string | null) => {
    if (!time) return "No limit";

    const [hours, minutes, seconds] = time.split(":").map(Number);
    if (hours === 0 && minutes === 0) return `${seconds}s`;
    if (hours === 0 && seconds === 0) return `${minutes}m`;
    if (minutes === 0 && seconds === 0) return `${hours}h`;
    if (minutes === 0) return `${hours}h ${seconds}s`;
    return `${hours}h ${minutes}m`;
};
