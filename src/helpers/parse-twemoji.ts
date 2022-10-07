import { parse } from 'twemoji-parser'

function parseTwemoji(emoji: string) {
    const [twemoji] = parse(emoji)

    return {
        src: twemoji.url,
        alt: twemoji.text,
        class: 'emoji',
        draggable: 'false',
    }
}

export { parseTwemoji }
