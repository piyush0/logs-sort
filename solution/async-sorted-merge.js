"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const Heap = require("../lib/heap");

const MAX_HEAP_SIZE = 1000

module.exports = (logSources, printer) => {
    return new Promise(async (resolve, reject) => {

        const heap = new Heap((a, b) => a.data.date.getTime() - b.data.date.getTime());

        await Promise.all(
            logSources.map(async (logSource, logSourceIndex) => {
                const current = await logSource.popAsync();
                if (current) {
                    heap.insert({data: current, listIndex: logSourceIndex});
                }
            })
        )

        // keep removing elements and add the next element from the list which we removed from.
        while (heap.size() > 0) {
            const currentElement = heap.remove();
            printer.print(currentElement.data);

            const logSourceIndex = currentElement.listIndex;

            // wait for the immediate next element
            const nextElement = await logSources[logSourceIndex].popAsync();
            if (nextElement) {
                heap.insert({data: nextElement, listIndex: logSourceIndex});
            }
        }


        printer.done();
        resolve(console.log("Async sort complete."));
    });
};
