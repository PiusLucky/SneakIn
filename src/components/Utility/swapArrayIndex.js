const arrayMoveMutate = (array, from, to) => {
    const startIndex = from < 0 ? array.length + from : from;

    if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;

        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
    }
};

const SwapArrayIndex = (array, from, to) => {
    array = [...array];
    arrayMoveMutate(array, from, to);
    return array;
};



export default SwapArrayIndex;