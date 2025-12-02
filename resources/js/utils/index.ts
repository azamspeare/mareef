export const calculateTime = (time: string | null) => {
    if (!time) return "No limit";

    const [hours, minutes, seconds] = time.split(":").map(Number);
    if (hours === 0 && minutes === 0) return `${seconds}s`;
    if (hours === 0 && seconds === 0) return `${minutes}m`;
    if (minutes === 0 && seconds === 0) return `${hours * 60}m`;
    if (minutes === 0) return `${hours * 60}m ${seconds}s`;
    return `${hours * 60 + minutes}m ${seconds}s`;
};
