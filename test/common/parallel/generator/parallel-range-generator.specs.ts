import {ParallelWorkerFunctions} from "../../../../src/common/parallel/parallel-worker-functions";
import {FunctionCallSerializer} from "../../../../src/common/function/function-call-serializer";
import {FunctionRegistry} from "../../../../src/common/function/function-registry";
import {ParallelRangeGenerator} from "../../../../src/common/parallel/generator/parallel-range-generator";

describe("ParallelRangeGenerator", function () {
    let functionCallSerializer: FunctionCallSerializer;
    let getOrSetIdSpy: jasmine.Spy;

    beforeEach(function () {
        getOrSetIdSpy = jasmine.createSpy("functionRegistry.getOrSetId");
        const functionRegistry: FunctionRegistry = {
            getOrSetId: getOrSetIdSpy
        } as any;

        functionCallSerializer = new FunctionCallSerializer(functionRegistry);
    });

    describe("create", function () {
        it("initializes the start with 0 and step with 1, if the function is called with a single, positive value", function () {
            // act
            const generator = ParallelRangeGenerator.create(10);

            // assert
            expect(generator.start).toBe(0);
            expect(generator.end).toBe(10);
            expect(generator.step).toBe(1);
        });

        it("initializes the start with 0 and step with -1, if the function is called with a single, negative value", function () {
            // act
            const generator = ParallelRangeGenerator.create(-10);

            // assert
            expect(generator.start).toBe(0);
            expect(generator.end).toBe(-10);
            expect(generator.step).toBe(-1);
        });

        it("initializes step with 1, if the function is called with two values and start is less then end", function () {
            // act
            const generator = ParallelRangeGenerator.create(1, 10);

            // assert
            expect(generator.start).toBe(1);
            expect(generator.end).toBe(10);
            expect(generator.step).toBe(1);
        });

        it("initializes step with -1, if the function is called with two arguments and start is larger then end", function () {
            // act
            const generator = ParallelRangeGenerator.create(10, 1);

            // assert
            expect(generator.start).toBe(10);
            expect(generator.end).toBe(1);
            expect(generator.step).toBe(-1);
        });
    });

    describe("length", function () {
        it("returns 0 for an empty range", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 0, 1);

            // act, assert
            expect(generator.length).toBe(0);
        });

        it("returns the number of elements in the range", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 10, 1);

            // act, assert
            expect(generator.length).toBe(10);
        });

        it("rounds the length up if it is not divisible by the step size (the first element is always included)", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 10, 3);

            // act, assert
            expect(generator.length).toBe(4);
        });
    });

    describe("serializeSlice", function () {
        it("serializes the range functions", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 10, 1);
            getOrSetIdSpy.and.returnValue(1);

            // act
            const func = generator.serializeSlice(0, 3, functionCallSerializer);

            // assert
            expect(func.functionId).toBe(1);
            expect(getOrSetIdSpy).toHaveBeenCalledWith(ParallelWorkerFunctions.range);
        });

        it("passes the start, end and step of the current slice as parameters", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 10, 1);
            getOrSetIdSpy.and.returnValue(1);

            // act
            const func = generator.serializeSlice(1, 3, functionCallSerializer);

            // assert
            expect(func.parameters).toEqual([3 /* start */, 6 /* end */, 1 /* step */]);
        });

        it("sets the slice end to end if it is the last slice and adding the full slice sice would exceed the limit", function () {
            // arrange
            const generator = ParallelRangeGenerator.create(0, 10, 1);
            getOrSetIdSpy.and.returnValue(1);

            // act
            const func = generator.serializeSlice(2, 4, functionCallSerializer);

            // assert
            expect(func.parameters).toEqual([8 /* start */, 10 /* end */, 1 /* step */]);
        });
    });
});
