<?php

namespace App\Http\Requests;

use App\Models\TaskAssigned;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateTaskAssignedRequest extends FormRequest
{
    private const PRIVILEGED_ROLES = ['admin', 'manager'];

    public function authorize(): bool
    {
        $user = $this->user();
        $task = TaskAssigned::findOrFail($this->route('id'));

        // Stash the resolved task so the controller doesn't have to re-fetch it.
        $this->attributes->set('task', $task);

        $isPrivileged = $user && in_array($user->role, self::PRIVILEGED_ROLES);
        $ownsTask = $user && (
            (int) $task->assigned_team === (int) $user->id
            || (int) $task->user_id === (int) $user->id
        );

        if (! $isPrivileged && ! $ownsTask) {
            $this->denyWith('You are not authorized to update this task.');
        }

        if ($task->status === 'Completed') {
            $this->denyWith('This task is completed and can no longer be edited.');
        }

        return true;
    }

    /**
     * Short-circuit with the same JSON shape the controller used to return,
     * instead of Laravel's default 403 authorization response.
     */
    private function denyWith(string $message): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $message,
        ], 403));
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'assigned_team' => 'required|exists:users,id',
            'user_id' => 'required|exists:users,id',
            'priority' => 'required|string',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'nullable|string',

            'attachments.*' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,gif,webp,pdf',

            'task_items' => 'nullable|array',
            'task_items.*.description' => 'required|string',
            'task_items.*.status' => 'nullable|string',
        ];
    }
}