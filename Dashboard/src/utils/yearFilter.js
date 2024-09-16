export const yearFilter = (degree) => {
    const uniqueYears = [...new Set(degree.map(deg => deg.degreeYear))];
    return uniqueYears.map((uniqueYear) => {
        const degreeList = degree.filter(deg => deg.degreeYear === uniqueYear);
        return {
            year_id: uniqueYear.split(' ').join('_').toLowerCase(),
            yearName: uniqueYear,
            degreeList: degreeList,
            agentList: [...new Set(degreeList.map(deg => deg.degreeAgent))]
        }
    })
}

export const degreeFilter = (degree, taskId) => {
    const yearName = taskId.split('_').join(' ').toUpperCase()
    const filteredDegree = degree.filter((degree)=>{
        return degree.degreeYear.toUpperCase() === yearName
    })
    return {filteredDegree, yearName}
}