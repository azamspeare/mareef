import { filterSuggestionItems } from "@blocknote/core/extensions";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    SuggestionMenuController,
    DragHandleButton,
    SideMenu,
    SideMenuController,
    AddBlockButton,
    DragHandleMenu,
    RemoveBlockItem,
    BlockNoteViewProps,
} from "@blocknote/react";
import { useTheme } from "next-themes";
import { getFilteredSlashMenuItems } from "@/lib/block-note";

interface WritingEditorProps {
    /** The BlockNote editor instance from useCreateBlockNote */
    editor: BlockNoteViewProps<any, any, any>["editor"];
    /** Called when the editor content changes */
    onChange?: () => void;
    /** Additional className for the wrapper */
    className?: string;
}

/**
 * Shared BlockNote editor component for writing forms.
 * Includes custom side menu (without colors) and filtered slash menu.
 */
export function WritingEditor({ editor, onChange, className }: WritingEditorProps) {
    const { theme } = useTheme();

    return (
        <div className={className ?? "mt-6 [&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 lg:-ml-12 form-writing-details"}>
            <BlockNoteView
                editor={editor}
                theme={theme === "dark" ? "dark" : "light"}
                slashMenu={false}
                sideMenu={false}
                onChange={onChange}
            >
                {/* Custom Side Menu - Remove Colors option */}
                <SideMenuController
                    sideMenu={(props) => (
                        <SideMenu {...props}>
                            <AddBlockButton key="addBlockButton" {...props} />
                            <DragHandleButton {...props} dragHandleMenu={(props) => (
                                <DragHandleMenu {...props}>
                                    <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
                                </DragHandleMenu>
                            )} />
                        </SideMenu>
                    )}
                />

                {/* Custom Slash Menu - Filter out unwanted items */}
                <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) =>
                        filterSuggestionItems(getFilteredSlashMenuItems(editor), query)
                    }
                />
            </BlockNoteView>
        </div>
    );
}
