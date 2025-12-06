'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Settings } from 'lucide-react';
import { TagSelector } from '@/components/tags/TagSelector';
import { TagManager } from '@/components/tags/TagManager';
import { useTags } from '@/hooks/useTags';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/api';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(500),
    description: z.string().max(2000).optional(),
    projectId: z.string().uuid('Select a project').optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueAt: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task | null;
    projectId?: string;
    projects: Array<{ id: string; name: string }>;
    onSubmit: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
}

export function TaskDialog({
    open,
    onOpenChange,
    task,
    projectId,
    projects,
    onSubmit,
}: TaskDialogProps) {
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            projectId: projectId || '',
            status: 'TODO',
            priority: 'MEDIUM',
            dueAt: '',
        },
    });

    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [showTagManager, setShowTagManager] = useState(false);
    const currentProjectId = form.watch('projectId');
    const { tags, createTag, updateTag, deleteTag, refetch } = useTags(currentProjectId);

    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title,
                description: task.description || '',
                projectId: task.projectId,
                status: task.status,
                priority: task.priority,
                dueAt: task.dueAt ? task.dueAt.split('T')[0] : '',
            });
            setSelectedTagIds(task.tags?.map(({ tag }) => tag.id) || []);
        } else {
            form.reset({
                title: '',
                description: '',
                projectId: projectId || '',
                status: 'TODO',
                priority: 'MEDIUM',
                dueAt: '',
            });
            setSelectedTagIds([]);
        }
    }, [task, projectId, form]);

    const handleSubmit = async (values: TaskFormValues) => {
        if (task) {
            // Editing existing task - don't include projectId
            const data: UpdateTaskDto = {
                title: values.title,
                description: values.description || undefined,
                status: values.status,
                priority: values.priority,
                dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : undefined,
                tagIds: selectedTagIds,
            };
            await onSubmit(data);
        } else {
            // Creating new task - include projectId
            const data: CreateTaskDto = {
                projectId: values.projectId!,
                title: values.title,
                description: values.description || undefined,
                status: values.status,
                priority: values.priority,
                dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : undefined,
                tagIds: selectedTagIds,
            };
            await onSubmit(data);
        }
        
        onOpenChange(false);
        form.reset();
        setSelectedTagIds([]);
    };

    const handleCreateTag = async (name: string, color: string) => {
        if (!currentProjectId) return;
        await createTag({ projectId: currentProjectId, name, color });
        await refetch();
    };

    const handleUpdateTag = async (tagId: string, name: string, color: string) => {
        await updateTag(tagId, { name, color });
    };

    const handleDeleteTag = async (tagId: string) => {
        await deleteTag(tagId);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                    <DialogDescription>
                        {task ? 'Update the task details below' : 'Fill in the details to create a new task'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {!task && (
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.id} value={project.id}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Task description (optional)"
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TODO">To Do</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="DONE">Done</SelectItem>
                                                <SelectItem value="CANCELED">Canceled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="dueAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {currentProjectId && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <TagSelector
                                            availableTags={tags}
                                            selectedTagIds={selectedTagIds}
                                            onTagsChange={setSelectedTagIds}
                                            onCreateTag={handleCreateTag}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowTagManager(true)}
                                        className="ml-2"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        {/* Tag Manager Dialog */}
        {currentProjectId && (
            <TagManager
                open={showTagManager}
                onOpenChange={setShowTagManager}
                tags={tags}
                onCreateTag={handleCreateTag}
                onUpdateTag={handleUpdateTag}
                onDeleteTag={handleDeleteTag}
            />
        )}
        </>
    );
}
