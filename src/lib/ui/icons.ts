// Source: https://lucide.dev/icons

interface IconProps {
    size?: number
    color?: string
    strokeWidth?: number
    linecap?: 'butt' | 'round' | 'square'
    linejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
    viewBox?: string
    Class?: string
}

function assembleIcon(svgPath: string, options: Partial<IconProps> = {}) {
    const defaultOptions: IconProps = {
        size: 24,
        color: 'currentColor',
        strokeWidth: 2,
        viewBox: '0 0 24 24',
        linecap: 'round',
        linejoin: 'round',
        Class: 'lucide lucide-play-icon lucide-play',
        ...options
    }

    return function Icon(props: IconProps = {}) {
        const mergedProps = { ...defaultOptions, ...props }
        const { size, viewBox, color, strokeWidth, linecap, linejoin, Class } = mergedProps

        return `
            <svg
                xmlns="http://www.w3.org/2000/svg" 
                width="${size}" 
                height="${size}" 
                 viewBox="${viewBox}" 
                fill="none" 
                stroke="${color}" 
                stroke-width="${strokeWidth}" 
                stroke-linecap="${linecap}" 
                stroke-linejoin="${linejoin}" 
                class="${Class}" 
            >
                ${svgPath}
            </svg>
        `
    }
}

const playPath = `<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>`
const pausePath = `<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>`
const downloadPath = `<path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/>`
const bookmarkPath = `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>`

export const Play = assembleIcon(playPath)
export const Pause = assembleIcon(pausePath)
export const Download = assembleIcon(downloadPath)
export const Bookmark = assembleIcon(bookmarkPath)

// --- Custom Variants of Logos
// export const smallPlay = assembleIcon(playPath, { size: 16 })