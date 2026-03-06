import { formatDistance } from "date-fns";

export function readableDateDiff(date: string | Date) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
