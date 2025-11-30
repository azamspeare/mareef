import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import BlockNote from "@/components/editors/BlockNote";
import Editor from "@/components/editors/Editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Test() {
    const [selectedEditor, setSelectedEditor] = useState("blocknote");
    const [blockNoteContent, setBlockNoteContent] = useState<any>(null);
    const [editorJsContent, setEditorJsContent] = useState<any>(null);

    return (
        <DashboardLayout title="Test Editors">
            <Head title="Test Editors - Mareff" />

            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editor Playground</h1>
                    <div className="w-[200px]">
                        <Select value={selectedEditor} onValueChange={setSelectedEditor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Editor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blocknote">BlockNote (Notion-style)</SelectItem>
                                <SelectItem value="editorjs">Editor.js (Notion-style)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {selectedEditor === "blocknote" ? "BlockNote Editor" : "Editor.js"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedEditor === "blocknote" ? (
                            <BlockNote
                                content={blockNoteContent}
                                onChange={setBlockNoteContent}
                            />
                        ) : (
                            <Editor
                                content={editorJsContent}
                                onChange={setEditorJsContent}
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Current Content State ({selectedEditor}):</h3>
                    <pre className="text-xs overflow-auto max-h-[200px]">
                        {JSON.stringify(selectedEditor === "blocknote" ? blockNoteContent : editorJsContent, null, 2)}
                    </pre>
                </div>
            </div>
        </DashboardLayout>
    );
}
