import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

import type { Extensions } from '@tiptap/react'

// Load all highlight.js supported languages
import lowlight from 'lowlight'

import { EmojiSuggestion, MentionSuggestion, EmojiReplacer, HexColorDecorator } from '../extensions'
import { formatHtml, markdownToHtml, htmlToMarkdown } from '../helpers/'

import { Toolbar } from './Toolbar'
import { Popover } from './Popover'

import './Tiptap.scss'

type TiptapProps = {
    content?: string
    editable?: boolean
    placeholder?: string
    withToolbar?: boolean
    withPopover?: boolean
    withTypographyExtension?: boolean
    withLinkExtension?: boolean
    withCodeBlockLowlightExtension?: boolean
    withTaskListExtension?: boolean
    withPlaceholderExtension?: boolean
    withMentionSuggestion?: boolean
    withEmojiSuggestion?: boolean
    withEmojisReplacer?: boolean
    withHexColorsDecorator?: boolean
}

function Tiptap({
    content = '',
    editable = true,
    placeholder = "Type '/' for actions…",
    withToolbar = false,
    withPopover = false,
    withTypographyExtension = false,
    withLinkExtension = false,
    withCodeBlockLowlightExtension = false,
    withTaskListExtension = false,
    withPlaceholderExtension = false,
    withMentionSuggestion = false,
    withEmojiSuggestion = false,
    withEmojisReplacer = false,
    withHexColorsDecorator = false,
}: TiptapProps) {
    const extensions: Extensions = [
        StarterKit.configure({
            ...(withCodeBlockLowlightExtension && { codeBlock: false }),
        }),
    ]

    if (withTypographyExtension) {
        extensions.push(Typography)
    }

    if (withLinkExtension) {
        extensions.push(
            Link.configure({
                linkOnPaste: false,
                openOnClick: false,
            }),
        )
    }

    if (withCodeBlockLowlightExtension) {
        extensions.push(
            CodeBlockLowlight.configure({
                lowlight,
            }),
        )
    }

    if (withTaskListExtension) {
        extensions.push(TaskList, TaskItem)
    }

    if (withPlaceholderExtension) {
        extensions.push(
            Placeholder.configure({
                placeholder,
            }),
        )
    }

    if (withMentionSuggestion) {
        extensions.push(MentionSuggestion)

        /*extensions.push(
            MentionSuggestion.configure({
                suggestion: {
                    char: '+',
                },
            }),
        )*/
    }

    if (withEmojiSuggestion) {
        extensions.push(EmojiSuggestion)
    }

    if (withEmojisReplacer) {
        extensions.push(EmojiReplacer)
    }

    if (withHexColorsDecorator) {
        extensions.push(HexColorDecorator)
    }

    const [editorHtmlContent, setEditorHtmlContent] = React.useState(content.trim())
    const [turndownMarkdownContent, setTurndownMarkdownContent] = React.useState('')
    const [markedHtmlContent, setMarkedHtmlContent] = React.useState('')

    const editor = useEditor({
        content,
        extensions,
        editable,
        onUpdate: ({ editor }) => {
            setEditorHtmlContent(editor.getHTML())
        },
    })

    React.useEffect(
        function convertHtmlToMarkdown() {
            setTurndownMarkdownContent(htmlToMarkdown(editorHtmlContent))
        },
        [editorHtmlContent],
    )

    React.useEffect(
        function convertMarkdownToHtml() {
            setMarkedHtmlContent(markdownToHtml(turndownMarkdownContent))
        },
        [turndownMarkdownContent],
    )

    if (!editor) {
        return null
    }

    return (
        <>
            <div className="WhiteCard">
                {withToolbar ? <Toolbar editor={editor} /> : null}
                {withPopover ? <Popover editor={editor} /> : null}
                <EditorContent editor={editor} />
            </div>
            <h2>Text (tiptap)</h2>
            <div className="WhiteCard">
                <pre>{editor.getText()}</pre>
            </div>
            <h2>HTML Output</h2>
            <div className="WhiteCard">
                <pre>{formatHtml(editorHtmlContent)}</pre>
            </div>
            <h2>HTML Output (tiptap) ➡ Turndown (lib) ➡ Markdown</h2>
            <div className="WhiteCard">
                <pre>{turndownMarkdownContent}</pre>
            </div>
            <h2>Markdown ➡ Marked (lib) ➡ DOMPurify (lib) ➡ HTML</h2>
            <div className="WhiteCard">
                <pre>{formatHtml(markedHtmlContent)}</pre>
            </div>
        </>
    )
}

export { Tiptap }
