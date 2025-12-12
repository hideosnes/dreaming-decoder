import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

type TimeUnit = 'seconds' | 'minutes' | 'hours'
export function changeTimeFormat(value: number, unit: TimeUnit = 'seconds'):
string {
    if (!Number.isFinite(value) || value < 0) {
        return 'nA'
    }

    let totalSeconds: number

    switch(unit) {
        case 'hours':
            totalSeconds = Math.floor(value * 3600)
            break
        case 'minutes':
            default:
            totalSeconds = Math.floor(value * 60)
            break
        case 'seconds':
            totalSeconds = Math.floor(value)
            break
    }

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const remainingSeconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2,'0')}:${remainingSeconds.toString().padStart(2,'0')}`
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}