const getSortedData = (data, prop, isAsc=false) => {
    return data.sort((a, b) => {
        return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1);
    });
};

export default getSortedData;
