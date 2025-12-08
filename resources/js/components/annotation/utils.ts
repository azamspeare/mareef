import type { Block } from '@blocknote/core';

/**
 * Extracts plain text from BlockNote content.
 * Handles nested blocks and inline content.
 */
export function extractPlainText(blocks: Block[]): string {
    if (!blocks || !Array.isArray(blocks)) return '';

    const textParts: string[] = [];

    function processInlineContent(content: any[]): string {
        if (!content || !Array.isArray(content)) return '';
        return content
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item?.type === 'text') return item.text || '';
                if (item?.type === 'link') {
                    return processInlineContent(item.content || []);
                }
                return '';
            })
            .join('');
    }

    function processBlock(block: Block): void {
        // Extract text from the block's content
        if (block.content) {
            const text = processInlineContent(block.content as any[]);
            if (text) {
                textParts.push(text);
            }
        }

        // Process nested children
        if (block.children && Array.isArray(block.children)) {
            for (const child of block.children) {
                processBlock(child);
            }
        }
    }

    for (const block of blocks) {
        processBlock(block);
    }

    return textParts.join('\n\n');
}
