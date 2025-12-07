import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import BlockNote from "@/components/editors/BlockNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Test() {
    const [blockNoteContent, setBlockNoteContent] = useState<any>(null);

    return (
        <DashboardLayout title="Test Editors">
            <Head title="Test Editors - Mareff" />

            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editor Playground</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>BlockNote Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BlockNote
                            content={blockNoteContent}
                            onChange={setBlockNoteContent}
                        />
                    </CardContent>
                </Card>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Current Content State:</h3>
                    <pre className="text-xs overflow-auto max-h-[200px]">
                        {JSON.stringify(blockNoteContent, null, 2)}
                    </pre>
                </div>
            </div>
        </DashboardLayout>
    );
}
