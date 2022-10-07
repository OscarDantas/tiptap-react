import { joinShortcodes, CompactEmoji } from 'emojibase'
import EMOJIBASE_REGEX from 'emojibase-regex'
import emojis from 'emojibase-data/en/compact.json'
import shortcodes from 'emojibase-data/en/shortcodes/emojibase.json'
import escapeRegExp from 'lodash-es/escapeRegExp.js'

type Emoji = {
    emoji: string
    shortcode?: string
}

/**
 * Join the English compact emoji dataset with the English shortcodes (e.g., `:grinning:`) into a
 * single object for easier manipulation.
 */
const emojisWithShortcodes = joinShortcodes(emojis as CompactEmoji[], [shortcodes])

let EMOJI_EMOTICONS: { [emoticon: string]: string } = {}
let EMOJI_SUGGESTIONS: Emoji[] = []

let emoticonsForRegex: string[] = []

/**
 * Use `forEach()` loop to go through the whole emojis data a single time, instead of using `map()`
 * twice, one for emoticons (e.g., `:)`), and another for shortcodes (e.g., `:grinning:`).
 */
emojisWithShortcodes.forEach(({ unicode, emoticon, shortcodes }) => {
    /**
     * Push all available emoticons to an array (escaped for a RegExp), and create a map
     * for a fast unicode emoji lookup based on the emoticon key.
     */
    if (emoticon) {
        emoticonsForRegex.push(escapeRegExp(emoticon))
        EMOJI_EMOTICONS[emoticon] = unicode
    }

    /**
     * Push all available unicode emojis and it's first shortcode to an array to be used with the
     * emoji suggestion extension.
     */
    if (shortcodes) {
        EMOJI_SUGGESTIONS.push({
            emoji: unicode,
            shortcode: `:${shortcodes[0]}:`.toLowerCase(),
        })
    }
})

/**
 * Join all available emoticons into a unified RegExp, which must match a space character at the
 * end, so that the the `emojis-replacer` doesn't trigger a replacement when typing `:)`, but only
 * when typing `:) `.
 *
 * Although Emojibase comes with `emojibase-regex/emoticon`, it unfortunately matches emoticons
 * permutations (i.e., `:)`, `:-)`), which are not part of the emoji dataset, making it impossible
 * to map emoticon permutations to a unicode emoji. Because of that, we create our own RegExp with
 * only the main emoticon for each unicode emoji.
 *
 * Ends the regex pattern on `$` dollar sign as documented here:
 * https://github.com/ueberdosis/tiptap/blob/f74f1ac/docs/guide/custom-extensions.md?plain=1#L410
 */
const EMOTICON_REGEX = new RegExp(`(?:${emoticonsForRegex.join('|')})\\s$`)

const EMOTICON_REGEX_PASTE = new RegExp(`(?:${emoticonsForRegex.join('|')})`, 'g')

/**
 * Creates a "unicode" RegExp based on Emojibase's regex patterns for matching both emoji and text
 * presentation characters.
 *
 * Ends the regex pattern on `$` dollar sign as documented here:
 * https://github.com/ueberdosis/tiptap/blob/f74f1ac/docs/guide/custom-extensions.md?plain=1#L410
 */
const UNICODE_REGEX = new RegExp(`(?:${EMOJIBASE_REGEX.source})$`)

const UNICODE_REGEX_PASTE = new RegExp(`(?:${EMOJIBASE_REGEX.source})`, 'g')

export {
    EMOJI_EMOTICONS,
    EMOJI_SUGGESTIONS,
    EMOTICON_REGEX,
    EMOTICON_REGEX_PASTE,
    UNICODE_REGEX,
    UNICODE_REGEX_PASTE,
}

export type { Emoji }
