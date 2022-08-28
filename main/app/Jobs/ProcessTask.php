<?php

namespace App\Jobs;

use App\Models\Task;
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
        Log::debug(1234);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::debug(12345);
        shell_exec('cd /Users/daniilvotintsev/Practice/ozon/broemu/ && node task.js '. $this->task->id .' > output.log');
    }
}
