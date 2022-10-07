import React from 'react'
import { SuggestionProps } from '@tiptap/suggestion'

import { Emoji } from '../../data'
import { parseTwemoji } from '../../helpers'
import { SuggestionDropdown } from './SuggestionDropdown'

import type { SuggestionDropdownRef } from './SuggestionDropdown'

import './EmojiDropdown.scss'

type EmojiDropdownProps = Pick<SuggestionProps, 'command'> & {
    items: Emoji[]
}

const EmojiDropdown = React.forwardRef<SuggestionDropdownRef, EmojiDropdownProps>(
    ({ items, command }, ref) => {
        function renderTwemojiComponent(emoji: string) {
            const twemoji = parseTwemoji(emoji)

            return (
                <img
                    className={twemoji.class}
                    src={twemoji.src}
                    alt={twemoji.alt}
                    draggable={Boolean(twemoji.draggable)}
                />
            )
        }

        return (
            <SuggestionDropdown
                forwardedRef={ref}
                items={items}
                onSelect={command}
                renderItem={({ emoji, shortcode }) => (
                    <div className="EmojiDropdownItem">
                        {renderTwemojiComponent(emoji)}
                        <span className="shortcode">{shortcode}</span>
                    </div>
                )}
            />
        )
    },
)

export { EmojiDropdown }
