<?php

namespace App\Jobs;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessTask implements ShouldQueue
{
    private $task;
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     * @var task
     * @return void
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::channel('job')->debug('Starting node command to scan.');
        $command = 'cd '. env('BROEMU_PATH') . ' && '. env('NODE_PATH') . ' task.js '. $this->task->id .' >> output.log';
        Log::debug($command);
        shell_exec($command);
    }
}
