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
        // "/root/.nvm/versions/node/v18.9.0/bin/node -r /var/www/ozonator/broemu/node_modules/dotenv/config /var/www/ozonator/broemu/task.js ". $this->task->id . ' dotenv_config_path=/var/www/ozonator/broemu/.env';
        $command = env('NODE_PATH') . ' -r ' . env('BROEMU_PATH') . 'node_modules/dotenv/config ' . env('BROEMU_PATH') . 'task.js ' . $this->task->id . ' dotenv_config_path=' . env('BROEMU_PATH') . '.env';
        Log::channel('job')->debug($command);
        $output = shell_exec($command);
        Log::channel('job')->debug($output);
    }
}
