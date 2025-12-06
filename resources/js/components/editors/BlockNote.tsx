import { filterSuggestionItems, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    FormattingToolbar,
    FormattingToolbarController,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from "@blocknote/react";
import {
    DragHandleButton,
    SideMenu,
    SideMenuController,
    AddBlockButton,
    DragHandleMenu,
    RemoveBlockItem,
} from "@blocknote/react";
import { useTheme } from "next-themes";

interface BlockNoteProps {
    content?: PartialBlock[];
    onChange?: (content: any) => void;
}

export default function BlockNote({ content, onChange }: BlockNoteProps) {
    const { resolvedTheme } = useTheme();

    // Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
    async function uploadFile(file: File) {
        const body = new FormData();
        body.append("file", file);
        const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: body,
        });
        return (await ret.json()).data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/",
        );
    }

    const editor = useCreateBlockNote({
        initialContent: content || [
            {
                type: "paragraph",
            },
        ],
        uploadFile,
    });

    // Filter slash menu items - remove Check List, Video, File, Emoji, Audio
    const getFilteredSlashMenuItems = () => {
        const defaultItems = getDefaultReactSlashMenuItems(editor);
        const excludeItems = ["Check List", "Video", "File", "Emoji", "Audio"];
        return defaultItems.filter(item => !excludeItems.includes(item.title));
    };

    const handleChange = () => {
        if (onChange) {
            onChange(editor.document);
        }
    };

    return (
        <div className="[&_.bn-editor]:pl-0 [&_.bn-block-group]:ml-0 lg:-ml-12 [&_.bn-editor]:bg-transparent [&_.bn-container]:bg-transparent" onChange={handleChange}>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                slashMenu={false}
                sideMenu={false}
                formattingToolbar={false}
                onChange={handleChange}
            >
                {/* Custom Side Menu - Remove Colors option */}
                <SideMenuController
                    sideMenu={(props) => (
                        <SideMenu {...props}>
                            <AddBlockButton {...props} />
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
                        filterSuggestionItems(getFilteredSlashMenuItems(), query)
                    }
                />

                {/* Custom Formatting Toolbar - Only show specific items */}
                <FormattingToolbarController
                    formattingToolbar={() => (
                        <FormattingToolbar>
                            <BlockTypeSelect key="blockTypeSelect" />
                            <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
                            <BasicTextStyleButton basicTextStyle="italic" key="italicStyleButton" />
                            <BasicTextStyleButton basicTextStyle="underline" key="underlineStyleButton" />
                            <BasicTextStyleButton basicTextStyle="strike" key="strikeStyleButton" />
                        </FormattingToolbar>
                    )}
                />
            </BlockNoteView>
        </div>
    );
}
