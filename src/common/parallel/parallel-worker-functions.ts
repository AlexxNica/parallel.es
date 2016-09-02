import {SerializedParallelAction} from "./parallel-action";
import {toArray, toIterator} from "../util/iterator";
import {SerializedFunctionCall} from "../serialization/serialized-function-call";
import {FunctionCallDeserializer} from "../serialization/function-call-deserializer";
import {staticFunctionRegistry} from "../serialization/static-function-registry";

export const ParallelWorkerFunctions = {
    process<T, TResult>(generator: SerializedFunctionCall, actions: SerializedParallelAction[], options: { functionCallDeserializer: FunctionCallDeserializer }): TResult[] {
        const generatorFunction = options.functionCallDeserializer.deserializeFunctionCall(generator, true);
        let iterator = generatorFunction() as Iterator<T>;

        for (const action of actions) {
            const coordinator = options.functionCallDeserializer.deserializeFunctionCall<Iterator<T>>(action.coordinator);
            const iteratee = options.functionCallDeserializer.deserializeFunctionCall(action.iteratee);
            iterator = coordinator(iterator, iteratee);
        }

        return toArray<TResult>(iterator as any);
    },

    map<T, TResult>(iterator: Iterator<T>, iteratee: (value: T) => TResult): Iterator<TResult> {
        return {
            next(): IteratorResult<TResult> {
                const result = iterator.next();
                if (result.done) {
                    return { done: true } as IteratorResult<TResult>;
                }
                return {
                    done: result.done,
                    value: iteratee(result.value)
                };
            }
        };
    },

    filter<T>(iterator: Iterator<T>, predicate: (value: T | undefined) => boolean): Iterator<T> {
        return {
            next() {
                let current: IteratorResult<T>;
                while (!(current = iterator.next()).done) {
                    if (predicate(current.value)) {
                        return current;
                    }
                }

                return current;
            }
        };
    },

    reduce<T, TResult>(defaultValue: TResult, iterator: Iterator<T>, iteratee: (accumulatedValue: TResult, value: T | undefined) => TResult): Iterator<TResult> {
        let accumulatedValue = defaultValue;
        let current: IteratorResult<T>;

        while (!(current = iterator.next()).done) {
            accumulatedValue = iteratee(accumulatedValue, current.value);
        }

        return toIterator([accumulatedValue]);
    },

    range(start: number, end: number, step: number): Iterator<number> {
        console.log("range", arguments);
        let next = start;
        return {
            next(): IteratorResult<number> {
                let current = next;
                next = current + step;
                if (current < end) {
                    return { done: false, value: current };
                }
                return { done: true } as IteratorResult<number>;
            }
        };
    },

    times<TResult>(start: number, end: number, iteratee: (i: number) => TResult): Iterator<TResult> {
        console.log("times", arguments);
        let next = start;
        return {
            next(): IteratorResult<TResult> {
                let current = next;
                next = current + 1;
                if (current < end) {
                    return { done: false, value: iteratee(current) };
                }
                return { done: true } as IteratorResult<TResult>;
            }
        };
    },

    identity<T>(element: T): T {
        return element;
    },

    toIterator<T>(array: T[]): Iterator<T> {
        return toIterator(array);
    }
};

staticFunctionRegistry.registerStaticFunctions(ParallelWorkerFunctions);