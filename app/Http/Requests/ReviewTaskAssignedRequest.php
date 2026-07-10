<?php

namespace App\Http\Requests;

use App\Models\TaskAssigned;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ReviewTaskAssignedRequest extends FormRequest
{
    private const PRIVILEGED_ROLES = ['admin', 'manager'];
    private const ADMIN_STATUS_REOPENED = 'Reopened';
    private const ADMIN_STATUS_APPROVED = 'Completed';

    public function authorize(): bool
    {
        $user = $this->user();
        $task = TaskAssigned::findOrFail($this->route('id'));
        $this->attributes->set('task', $task);

        if (! $user || ! in_array($user->role, self::PRIVILEGED_ROLES)) {
            $this->denyWith('Only admins or managers can review completed tasks.');
        }

        if ($task->status !== 'Completed') {
            $this->denyWith('Only completed tasks can be reviewed.');
        }

        if ($task->admin_status === self::ADMIN_STATUS_APPROVED) {
            $this->denyWith('This task has already been approved and finalized.');
        }

        return true;
    }

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
            'admin_status' => 'required|in:' . self::ADMIN_STATUS_REOPENED . ',' . self::ADMIN_STATUS_APPROVED,
            'admin_remarks' => 'nullable|string',
        ];
    }
}