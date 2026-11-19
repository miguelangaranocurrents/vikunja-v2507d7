import type {Fragment, Node as ProseMirrorNode} from '@tiptap/pm/model'

const LIST_NODE_NAMES = ['bulletList', 'orderedList']

// Plain text for the clipboard. ProseMirror's default joins blocks with blank lines and
// drops list markers, so a copied bullet list would paste as loose sentences.
function listToText(list: ProseMirrorNode, indent = ''): string {
	const ordered = list.type.name === 'orderedList'
	const lines: string[] = []

	list.forEach((item, _offset, index) => {
		const marker = ordered ? `${index + 1}. ` : '- '
		const parts: string[] = []

		item.forEach((child) => {
			if (LIST_NODE_NAMES.includes(child.type.name)) {
				parts.push(listToText(child, indent + '  '))
			} else {
				parts.push(child.textBetween(0, child.content.size, '\n'))
			}
		})

		lines.push(indent + marker + parts.join('\n'))
	})

	return lines.join('\n')
}

export function fragmentToPlainText(fragment: Fragment): string {
	const blocks: string[] = []

	fragment.forEach((node) => {
		if (LIST_NODE_NAMES.includes(node.type.name)) {
			blocks.push(listToText(node))
		} else {
			blocks.push(node.textBetween(0, node.content.size, '\n\n'))
		}
	})

	return blocks.join('\n\n')
}
