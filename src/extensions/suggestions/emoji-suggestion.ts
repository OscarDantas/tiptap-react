import { Node } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state'
import tippy, { Instance, Props } from 'tippy.js'
import filter from 'lodash-es/filter.js'

import { EMOJI_SUGGESTIONS } from '../../data'
import { parseTwemoji } from '../../helpers'
import { SuggestionDropdownRef } from './SuggestionDropdown'
import { EmojiDropdown } from './EmojiDropdown'

type EmojiOptions = {
    suggestion: Omit<SuggestionOptions, 'editor'>
}

const EmojiSuggestion = Node.create<EmojiOptions>({
    name: 'emojiSuggestion',
    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,
    addOptions() {
        return {
            suggestion: {
                char: ':',
                pluginKey: new PluginKey('emojiSuggestion'),
                command: ({ editor, range, props }) => {
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter
                    const overrideSpace = nodeAfter?.text?.startsWith(' ')

                    if (overrideSpace) {
                        range.to += 1
                    }

                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                            {
                                type: 'emojiSuggestion',
                                attrs: props,
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                        ])
                        .run()
                },
                allow: ({ editor, range }) => {
                    return editor.can().insertContentAt(range, { type: 'emojiSuggestion' })
                },
                items: ({ query }) => {
                    return filter(EMOJI_SUGGESTIONS, ({ shortcode }) =>
                        shortcode?.includes(query.toLowerCase()),
                    )
                },
                render: () => {
                    let reactRenderer: ReactRenderer<SuggestionDropdownRef>
                    let popup: Instance<Props>[]

                    let wasAlphanumericPressed = false
                    let wasBackspacePressed = false

                    return {
                        onStart: (props) => {
                            reactRenderer = new ReactRenderer(EmojiDropdown, {
                                props,
                                editor: props.editor,
                            })

                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect,
                                appendTo: () => document.body,
                                content: reactRenderer.element,
                                showOnCreate: false,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'bottom-start',
                            })
                        },
                        onUpdate(props) {
                            // Hide the dropdown when the first character is reached with backspace
                            if (wasBackspacePressed && props.query.length === 1) {
                                popup[0].hide()
                                return
                            }

                            // Show the dropdown only after the the colon and the first character
                            if (wasAlphanumericPressed && props.query.length >= 2) {
                                popup[0].show()
                            }

                            reactRenderer.updateProps(props)

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            })
                        },
                        onKeyDown(props) {
                            wasAlphanumericPressed = /^\w$/.test(props.event.key)
                            wasBackspacePressed = props.event.key === 'Backspace'

                            if (props.event.key === 'Escape') {
                                popup[0].hide()
                                return true
                            }

                            return Boolean(reactRenderer.ref?.onKeyDown(props))
                        },
                        onExit() {
                            popup[0].destroy()
                            reactRenderer.destroy()
                        },
                    }
                },
            },
        }
    },
    addAttributes() {
        return {
            emoji: {
                default: null,
                parseHTML: (element) => element.children[0].getAttribute('alt'),
                renderHTML: (attributes) => {
                    if (!attributes.emoji) {
                        return {}
                    }

                    return parseTwemoji(attributes.emoji)
                },
            },
        }
    },
    parseHTML() {
        return [{ tag: 'span[data-emoji-suggestion]' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', { 'data-emoji-suggestion': '' }, ['img', HTMLAttributes]]
    },
    renderText({ node }) {
        return node.attrs.emoji
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export { EmojiSuggestion }
