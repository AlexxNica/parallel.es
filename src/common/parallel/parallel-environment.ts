/**
 * @module parallel
 */
/** needed, typedoc issue */

/**
 * Environment that can be accessed inside of a iteratee function
 */
export interface IEmptyParallelEnvironment {
    [name: string]: any;
}

/**
 * Environment that is available to all iteratee functions and is filled by parallel
 */
export interface IParallelTaskEnvironment extends IEmptyParallelEnvironment {
    /**
     * The index of the task. The index is relative to the other tasks created to process a single parallel operation.
     */
    taskIndex: number;

    /**
     * The number of values that are processed by each task at most (the last task may process less then the number of values specified)
     */
    valuesPerTask: number;
}
