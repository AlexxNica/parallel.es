import {IThreadPool} from "./thread-pool";
import {IWorkerThread} from "../worker/worker-thread";
import {ITaskDefinition} from "../task/task-definition";
import {IWorkerThreadFactory} from "../worker/worker-thread-factory";
import {WorkerTask} from "../task/worker-task";
import {ITask} from "../task/task";
import {FunctionCallSerializer} from "../function/function-call-serializer";
import {FunctionCall} from "../function/function-call";
import {IFunctionId} from "../function/function-id";

/**
 * Default thread pool implementation that processes the scheduled functions in FIFO order.
 */
export class DefaultThreadPool implements IThreadPool {
    private workers: IWorkerThread[] = [];
    private idleWorkers: IWorkerThread[] = [];
    private queue: WorkerTask<any>[] = [];
    private lastTaskId = -1;
    private concurrencyLimit: number;

    constructor(private workerThreadFactory: IWorkerThreadFactory, private functionCallSerializer: FunctionCallSerializer, options: { maxConcurrencyLevel: number }) {
        this.concurrencyLimit = options.maxConcurrencyLevel;
    }

    public schedule<TResult>(func: ((this: void, ...params: any[]) => TResult) | IFunctionId, ...params: any[]): ITask<TResult> {
        const serializedFunc = this.functionCallSerializer.serializeFunctionCall(FunctionCall.createUnchecked(func, ...params));
        const taskDefinition: ITaskDefinition = { main: serializedFunc, usedFunctionIds: [ serializedFunc.functionId ] };
        return this.scheduleTask(taskDefinition);
    }

    public scheduleTask<TResult>(taskDefinition: ITaskDefinition): ITask<TResult> {
        taskDefinition.id = ++this.lastTaskId;
        const task = new WorkerTask<TResult>(taskDefinition);

        task.always(() => this._releaseWorker(task));

        this.queue.unshift(task);
        this._schedulePendingTasks();

        return task;
    }

    public getFunctionSerializer(): FunctionCallSerializer {
        return this.functionCallSerializer;
    }

    private _releaseWorker(task: WorkerTask<any>): void {
        const worker = task.releaseWorker();
        this.idleWorkers.push(worker);

        this._schedulePendingTasks();
    }

    private _schedulePendingTasks(): void {
        while (this.queue.length) {
            let worker: IWorkerThread | undefined;
            if (this.idleWorkers.length === 0 && this.workers.length < this.concurrencyLimit) {
                worker = this.workerThreadFactory.spawn();
                this.workers.push(worker);
            } else if (this.idleWorkers.length > 0) {
                worker = this.idleWorkers.pop();
            }

            if (!worker) {
                return;
            }

            const task = <WorkerTask<any>> this.queue.pop();
            task.runOn(worker);
        }
    }
}