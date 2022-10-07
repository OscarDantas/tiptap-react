import TurndownService from 'turndown'

/**
 * Initialize Turndown with sensible defaults.
 */
const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '*',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
})

/**
 * Custom rule for strikethrough.
 */
turndownService.addRule('strikethrough', {
    filter: ['s'],
    replacement: (content) => {
        return `~~${content}~~`
    },
})

/**
 * Custom rule for paragraphs which removes the `<p></p>` tag inside `<li>` elements.
 */
turndownService.addRule('paragraph', {
    filter: ['p'],
    replacement: (content, node) => {
        if (node.parentElement?.nodeName === 'LI') {
            return content
        }

        return `\n\n${content}\n\n`
    },
})

/**
 * Custom rule for standard list items (i.e., not task list items) based on the original rule:
 * https://github.com/mixmark-io/turndown/blob/master/src/commonmark-rules.js
 */
turndownService.addRule('listItem', {
    filter: (node: Element) => {
        return node.nodeName === 'LI' && !node.hasAttribute('data-type')
    },
    replacement: function (content, node, options) {
        let listItemPrefix = `${options.bulletListMarker} `
        const parentNode = node.parentNode as HTMLElement | null

        content = content
            .replace(/^\s*\n+/, '')
            .replace(/\s*\n+$/, '\n')
            .replace(/\s*\n/gm, '\n  ')

        if (parentNode?.nodeName === 'OL') {
            const start = parentNode?.getAttribute('start')
            const index = Array.prototype.indexOf.call(parentNode.children, node)
            listItemPrefix = `${start ? Number(start) + index : index + 1}. `
        }

        return `${listItemPrefix}${content}${node.nextSibling && !/\n$/.test(content) ? '\n' : ''}`
    },
})

/**
 * Custom rule for task list items (i.e., `* [ ] Task`) based on the original list item rule:
 * https://github.com/mixmark-io/turndown/blob/master/src/commonmark-rules.js#L61
 */
turndownService.addRule('taskListItem', {
    filter: (node: Element) => {
        return node.nodeName === 'LI' && node.getAttribute('data-type') === 'taskItem'
    },
    replacement: function (content, node, options) {
        let listItemPrefix = `${options.bulletListMarker} `
        const parentNode = node.parentNode as HTMLElement | null

        content = content
            .replace(/^\s*\n+/, '')
            .replace(/\s*\n+$/, '\n')
            .replace(/\s*\n/gm, '\n  ')

        if (parentNode?.nodeName === 'UL') {
            const checked = (node as HTMLLIElement).getAttribute('data-checked')
            listItemPrefix = `${listItemPrefix}${checked === 'true' ? '[x]' : '[ ]'} `
        }

        return `${listItemPrefix}${content}${node.nextSibling && !/\n$/.test(content) ? '\n' : ''}`
    },
})

/**
 * Custom rule for user mentions (i.e., `@Ricardo A`).
 */
turndownService.addRule('mention', {
    filter: (node: Element) => {
        return node.nodeName === 'SPAN' && node.hasAttribute('data-mention')
    },
    replacement: (content, node, options) => {
        return `(${content.substring(1)})[user-mention://${
            (node as Element).getAttribute('data-user-id') || 0
        }]`
    },
})

/**
 * Custom rule for Twemoji (supports both the emoji suggestions, and the emoji replacer).
 */
turndownService.addRule('emoji', {
    filter: (node: Element) => {
        return (
            node.nodeName === 'SPAN' &&
            (node.hasAttribute('data-emoji-suggestion') || node.hasAttribute('data-emoji-replacer'))
        )
    },
    replacement: (_, node) => {
        return (node.firstChild as Element).getAttribute('alt') || ''
    },
})

function htmlToMarkdown(html: string) {
    return turndownService.turndown(html)
}

export { htmlToMarkdown }
