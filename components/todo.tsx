import { deleteTodo, updateTodo } from "actions/todo-actions";
import { Checkbox, IconButton, Spinner } from "node_modules/@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Todo({ todo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [completed, setCompleted] = useState(todo.completed);
    const [title, setTitle] = useState(todo.title);

    const queryClient = useQueryClient();

    const updateTodoMutation = useMutation({
        mutationFn: () => updateTodo({
            id: todo.id,
            title: title,
            completed: completed,
        }),
        onSuccess: async () => {
            await setIsEditing(false)
            await queryClient.invalidateQueries({
                queryKey: ["todos"]
            });
        }
    });

    const deleteTodoMutation = useMutation({
        mutationFn: () => deleteTodo(todo.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos"]
            });
        }
    })


    return (
        <div className="w-full flex items-center gap-1">
            <Checkbox
                checked={completed}
                onChange={async (e) => {
                    await setCompleted(e.target.checked)
                    await updateTodoMutation.mutate()
                }}
            />

            {
                isEditing ? (
                    <input
                        className="flex-1 border-b-black border-b pb-1"
                        type="text"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                ) : (
                    <p className={`flex-1 ${completed && "line-through"}`}>{title}</p>
                )
            }
            
                {
                    isEditing ? (
                        <IconButton onClick={() => updateTodoMutation.mutate()}>
                            {
                                updateTodoMutation.isPending ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <i className="fas fa-check"></i>
                                )
                            }
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => setIsEditing(true)}>
                        <i className="fas fa-pen"></i>
                        </IconButton>
                    )
                }
            <IconButton onClick={() => deleteTodoMutation.mutate()}>
                {
                    deleteTodoMutation.isPending ? (
                        <Spinner size="sm" />
                    ) : (
                        <i className="fas fa-trash"></i>
                    )
                }
            </IconButton>
        </div>
    );
}