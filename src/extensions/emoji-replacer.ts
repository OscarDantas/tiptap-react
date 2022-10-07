import { nodeInputRule, PasteRule, Node } from '@tiptap/core'

import {
    EMOJI_EMOTICONS,
    EMOTICON_REGEX,
    EMOTICON_REGEX_PASTE,
    UNICODE_REGEX,
    UNICODE_REGEX_PASTE,
} from '../data'
import { parseTwemoji } from '../helpers'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        emojiReplacer: {
            insertEmoji: (emoji: string) => ReturnType
        }
    }
}

const EmojiReplacer = Node.create({
    name: 'emojiReplacer',
    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,
    addAttributes() {
        return {
            emoji: {
                default: null,
                parseHTML: (element) => element.children[0].getAttribute('alt'),
                renderHTML: (attributes) => {
                    if (!attributes.emoji) {
                        return {}
                    }

                    if (UNICODE_REGEX.test(attributes.emoji)) {
                        return parseTwemoji(attributes.emoji)
                    }

                    return parseTwemoji(EMOJI_EMOTICONS[attributes.emoji])
                },
            },
        }
    },
    parseHTML() {
        return [{ tag: 'span[data-emoji-replacer]' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', { 'data-emoji-replacer': '' }, ['img', HTMLAttributes]]
    },
    renderText({ node }) {
        return node.attrs.emoji
    },
    addCommands() {
        return {
            insertEmoji: (emoji) => ({ tr, dispatch }) => {
                const node = this.type.create({ emoji })

                if (dispatch) {
                    tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
                }

                return true
            },
        }
    },
    addKeyboardShortcuts() {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    const { empty, anchor } = state.selection

                    if (!empty) {
                        return false
                    }

                    let isBackspaceHandled = false

                    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                        if (node.type.name === 'emojiReplacer') {
                            tr.deleteRange(pos, pos + node.nodeSize)
                            isBackspaceHandled = true
                            return false
                        }
                    })

                    return isBackspaceHandled
                }),
        }
    },
    addInputRules() {
        return [
            nodeInputRule({
                find: EMOTICON_REGEX,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        emoji: match[0].trim(),
                    }
                },
            }),
            nodeInputRule({
                find: UNICODE_REGEX,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        emoji: match[0].trim(),
                    }
                },
            }),
        ]
    },
    addPasteRules() {
        return [
            new PasteRule({
                find: EMOTICON_REGEX_PASTE,
                handler: ({ state, range, match }) => {
                    const { tr } = state

                    tr.replaceWith(
                        range.from,
                        range.to,
                        this.type.create({
                            emoji: match[0].trim(),
                        }),
                    )
                },
            }),
            new PasteRule({
                find: UNICODE_REGEX_PASTE,
                handler: ({ state, range, match }) => {
                    const { tr } = state

                    tr.replaceWith(
                        range.from,
                        range.to,
                        this.type.create({
                            emoji: match[0].trim(),
                        }),
                    )
                },
            }),
        ]
    },
})

export { EmojiReplacer }
