import type { BlockNoteEditor } from '@blocknote/core'
import { getDefaultReactSlashMenuItems } from '@blocknote/react'

/** Default items to exclude from the slash menu in writing forms */
const DEFAULT_EXCLUDED_ITEMS = ['Check List', 'Video', 'File', 'Emoji', 'Audio']

/**
 * Get filtered slash menu items for BlockNote editor.
 * Removes items that aren't needed for writing tasks.
 *
 * @example
 * const editor = useCreateBlockNote()
 *
 * <SuggestionMenuController
 *   triggerCharacter="/"
 *   getItems={async (query) =>
 *     filterSuggestionItems(getFilteredSlashMenuItems(editor), query)
 *   }
 * />
 */
export function getFilteredSlashMenuItems(
  editor: BlockNoteEditor<any, any, any>,
  excludeItems: string[] = DEFAULT_EXCLUDED_ITEMS
) {
  const defaultItems = getDefaultReactSlashMenuItems(editor)
  return defaultItems.filter((item) => !excludeItems.includes(item.title))
}

/**
 * Auto-resize a textarea element to fit its content.
 *
 * @example
 * const titleRef = useRef<HTMLTextAreaElement>(null)
 *
 * <textarea
 *   ref={titleRef}
 *   onInput={() => autoResizeTextarea(titleRef.current)}
 * />
 */
export function autoResizeTextarea(element: HTMLTextAreaElement | null): void {
  if (!element) return
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}
