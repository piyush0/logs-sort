"use strict";

const Heap = require('../lib/heap')
// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
    const heap = new Heap((a, b) => a.data.date.getTime() - b.data.date.getTime());

    // insert the first log item from each log source
    logSources.forEach((logSource, logSourceIndex) => {
        heap.insert({data: logSource.pop(), listIndex: logSourceIndex});
    })

    // keep removing elements and add the next element from the list which we removed from.
    while (heap.size() > 0) {
        const currentElement = heap.remove();
        printer.print(currentElement.data);

        const logSourceIndex = currentElement.listIndex;
        const nextElement = logSources[logSourceIndex].pop();
        if (nextElement) {
            heap.insert({data: nextElement, listIndex: logSourceIndex});
        }
    }

    printer.done();
    return console.log("Sync sort complete.");
};
