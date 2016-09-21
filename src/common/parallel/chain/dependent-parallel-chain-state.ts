import {IParallelChainState, IScheduledParallelChainState, IParallelChainEnvironment} from "./parallel-chain-state";
import {IParallelOperation, IDefaultInitializedParallelOptions} from "../";
import {IParallelStream, ParallelStream} from "../stream/parallel-stream";
import {ScheduledParallelChainState} from "./scheduled-parallel-chain-state";
import {ParallelCollectionGenerator} from "../generator/parallel-collection-generator";
import {flattenArray} from "../../util/arrays";

/**
 * The state of a parallel chain if additional operations should be performed on an already scheduled parallel chain.
 *
 * The state needs to wait for the previous parallel job to complete and then take that result to continue the additional
 * computations.
 *
 * @param TPrevious Type of the array elements of the dependent stream
 * @param TElement Type of the array elements of the resulting array
 */
export class DependentParallelChainState<TPrevious, TElement> implements IParallelChainState<TElement> {

    /**
     * Creates a new dependent stream
     * @param previousStream the stream upon which the new stream depends on
     * @param options the options used by this parallel job
     * @param environment the environment used by the job
     * @param operations the operations to performed when the previous stream has completed
     */
    constructor(private previousStream: IParallelStream<TPrevious[], TPrevious[]>, private options: IDefaultInitializedParallelOptions, private environment: IParallelChainEnvironment, private operations: IParallelOperation[] = []) {}

    public resolve(): IScheduledParallelChainState<TElement> {
        let next: ((subResult: TElement[], taskIndex: number, valuesPerTask: number) => void) | undefined = undefined;
        let resolve: ((result: TElement[]) => void) | undefined = undefined;
        let reject: ((reason: any) => void) | undefined = undefined;

        const stream = new ParallelStream((nxt, rsolve, rject) => {
            next = nxt;
            resolve = rsolve;
            reject = rject;
        });

        this.previousStream.then(result => {
            const tasks = this.options.scheduler.schedule({
                environment: this.environment,
                generator: new ParallelCollectionGenerator(result),
                operations: this.operations,
                options: this.options
            });

            const wrappedStream = ParallelStream.fromTasks(tasks, flattenArray);
            wrappedStream.subscribe(next!, reject!, resolve!);
        }, reject!);

        return new ScheduledParallelChainState(stream, this.options, this.environment);
    }

    public chainOperation<TElementNew>(operation: IParallelOperation): IParallelChainState<TElementNew> {
        return new DependentParallelChainState<TPrevious, TElementNew>(this.previousStream, this.options, this.environment, [...this.operations, operation]);
    }

    public changeEnvironment(environment: IParallelChainEnvironment): IParallelChainState<TElement> {
        return new DependentParallelChainState(this.previousStream, this.options, environment, this.operations);
    }
}
