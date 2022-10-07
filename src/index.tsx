import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Redirect, Route, NavLink } from 'react-router-dom'

import { Tiptap } from './components'

import {
    BASIC_CONTENT,
    MARKDOWN_SHORTCUTS_CONTENT,
    POPOVER_EDITOR_CONTENT,
    SUGGESTIONS_EDITOR_CONTENT,
    SYNTAX_HIGHLGHTING_CONTENT,
    LONG_DOCUMENT_PERFORMANCE_CONTENT,
    READ_ONLY_MODE_CONTENT,
    READ_ONLY_MODE_V2_CONTENT,
} from './data'

import './index.scss'

render(
    <BrowserRouter>
        <div id="Wrapper">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/basic" activeClassName="selected">
                            Basic
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/popover-editor" activeClassName="selected">
                            Popover Editor
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/suggestions" activeClassName="selected">
                            Suggestions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/markdown-shortcuts" activeClassName="selected">
                            Markdown Shortcuts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/syntax-highlighting" activeClassName="selected">
                            Syntax Highlighting
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/placeholder-text" activeClassName="selected">
                            Placeholder Text
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/long-document-performance" activeClassName="selected">
                            Long Document Performance
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/read-only-mode" activeClassName="selected">
                            Read-only Mode
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/read-only-mode-v2" activeClassName="selected">
                            Read-only Mode v2
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <Route exact path="/">
                <Redirect to="/basic" />
            </Route>
            <Route path="/basic">
                <Tiptap
                    content={BASIC_CONTENT}
                    withToolbar={true}
                    withTaskListExtension={true}
                    withLinkExtension={true}
                    withEmojisReplacer={true}
                />
            </Route>
            <Route path="/popover-editor">
                <Tiptap
                    content={POPOVER_EDITOR_CONTENT}
                    withPopover={true}
                    withLinkExtension={true}
                />
            </Route>
            <Route path="/markdown-shortcuts">
                <Tiptap
                    content={MARKDOWN_SHORTCUTS_CONTENT}
                    withTypographyExtension={true}
                    withEmojisReplacer={true}
                    withHexColorsDecorator={true}
                />
            </Route>
            <Route path="/suggestions">
                <Tiptap
                    //content={SUGGESTIONS_EDITOR_CONTENT}
                    withMentionSuggestion={true}
                    withEmojiSuggestion={true}
                />
            </Route>
            <Route path="/syntax-highlighting">
                <Tiptap
                    content={SYNTAX_HIGHLGHTING_CONTENT}
                    withCodeBlockLowlightExtension={true}
                />
            </Route>
            <Route path="/placeholder-text">
                <Tiptap withPlaceholderExtension={true} withEmojisReplacer={true} />
            </Route>
            <Route path="/long-document-performance">
                <Tiptap content={LONG_DOCUMENT_PERFORMANCE_CONTENT} withToolbar={true} />
            </Route>
            <Route path="/read-only-mode">
                {[...Array(20)].map((_, key) => (
                    <Tiptap
                        key={key}
                        content={READ_ONLY_MODE_CONTENT}
                        editable={false}
                        withTaskListExtension={true}
                        withLinkExtension={true}
                        withEmojisReplacer={true}
                        withTypographyExtension={true}
                        withHexColorsDecorator={true}
                        withMentionSuggestion={true}
                        withEmojiSuggestion={true}
                        withCodeBlockLowlightExtension={true}
                    />
                ))}
            </Route>
            <Route path="/read-only-mode-v2">
                {[...Array(300)].map((_, key) => (
                    <Tiptap
                        key={key}
                        content={READ_ONLY_MODE_V2_CONTENT}
                        editable={false}
                        withTaskListExtension={true}
                        withLinkExtension={true}
                        withEmojisReplacer={true}
                        withTypographyExtension={true}
                        withHexColorsDecorator={true}
                        withMentionSuggestion={true}
                        withEmojiSuggestion={true}
                        withCodeBlockLowlightExtension={true}
                    />
                ))}
            </Route>
        </div>
    </BrowserRouter>,
    document.getElementById('root'),
)
