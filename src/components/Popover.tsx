import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiH1,
    RiH2,
    RiCodeSSlashLine,
    RiLink,
    RiLinkUnlink,
} from 'react-icons/ri'

import { setLink } from '../helpers'

import './Popover.scss'

type PopoverProps = {
    editor: Editor
}

function Popover({ editor }: PopoverProps) {
    const isSelectionOverLink = editor.getAttributes('link').href

    return (
        <BubbleMenu className="Popover" editor={editor}>
            <div className="icon" onClick={() => editor.chain().focus().toggleBold().run()}>
                <RiBold />
            </div>
            <div className="icon" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <RiItalic />
            </div>
            <div className="icon" onClick={() => editor.chain().focus().toggleStrike().run()}>
                <RiStrikethrough />
            </div>
            <div
                className="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <RiH1 />
            </div>
            <div
                className="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <RiH2 />
            </div>
            <div
                className="icon"
                onClick={() =>
                    isSelectionOverLink ? editor.chain().focus().unsetLink().run() : setLink(editor)
                }>
                {isSelectionOverLink ? <RiLinkUnlink /> : <RiLink />}
            </div>
            <div className="icon" onClick={() => editor.chain().focus().toggleCode().run()}>
                <RiCodeSSlashLine />
            </div>
        </BubbleMenu>
    )
}

export { Popover }
