import React from 'react'
import { SuggestionProps } from '@tiptap/suggestion'

import { Mention } from '../../data'
import { SuggestionDropdown } from './SuggestionDropdown'

import type { SuggestionDropdownRef } from './SuggestionDropdown'

import './MentionDropdown.scss'

type MentionDropdownProps = Pick<SuggestionProps, 'command'> & {
    items: Mention[]
}

const MentionDropdown = React.forwardRef<SuggestionDropdownRef, MentionDropdownProps>(
    ({ items, command }, ref) => (
        <SuggestionDropdown
            forwardedRef={ref}
            items={items}
            onSelect={command}
            renderItem={({ name }) => (
                <div className="MentionDropdownItem">
                    <img
                        className="avatar"
                        src={`https://avatars.dicebear.com/api/jdenticon/${name}.svg`}
                        alt={`${name}'s Avatar`}
                        title={`${name}'s Avatar`}
                    />
                    <span className="name">{name}</span>
                </div>
            )}
        />
    ),
)

export { MentionDropdown }
