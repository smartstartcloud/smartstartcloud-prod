export const yearFilter = (degree) => {
    const uniqueYears = [...new Set(degree.map(deg => deg.degreeYear))];
    return uniqueYears.map((uniqueYear) => {
        const degreeList = degree.filter(deg => deg.degreeYear === uniqueYear);
        return {
            year_id: uniqueYear,
            yearName: formatDateString(uniqueYear),
            degreeList: degreeList,
            agentList: [...new Set(degreeList.map(deg => deg.degreeAgent))]
        }
    })
}

// convert "january_2025" to "JANUARY 2025"
export const formatDateString = (dateString) => {
    // Check if the dateString is valid
    if (dateString === undefined) {
        return "Invalid Date";
    }
    // Split the input string by underscore
    const [month, year] = dateString.split('_');

    // Capitalize the first letter of the month and lowercase the rest
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

    // Combine the formatted month and year with a space
    return `${formattedMonth} ${year}`;
}

// from degree_year return the year only "january_2025" to "2025"
export const formatDateStringYearOnly = (dateString) => {    
    // Split the input string by underscore
    const [year] = dateString.split('_');
    // Combine the formatted month and year with a space
    return year;
}

export const degreeFilter = (degree, degreeYear) => {
    const yearName = degreeYear
    const filteredDegree = degree.filter((degree)=>{
        return degree.degreeYear === yearName
    })
    return {filteredDegree, yearName}
}

export const degreeFilterByAgent = (degree, degreeYear, id) => {
    const yearName = degreeYear
    const filteredDegree = degree.filter((degree)=>{
        return (degree.degreeYear === yearName && degree.degreeAgent._id === id)
    })
    return {filteredDegree, yearName}
}