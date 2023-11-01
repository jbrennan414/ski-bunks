const months = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October",
    "November",
    "December" 
]

const days = [
    "Sunday",
    "Monday",
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday",
    "Saturday",
    "Sunday"
]

export const getDayOfWeek = (fullpath) => {

    const year = fullpath.substring(0,4);
    const month = convertHumanMonthToInteger(fullpath.substring(4,6));
    const day = fullpath.substring(6,8);

    const date = new Date(year, month, day);

    return days[date.getDay()];

};

export const getMonth = (fullpath) => {
    //Do something with the input

    const year = fullpath.substring(0,4);
    const month = convertHumanMonthToInteger(fullpath.substring(4,6));
    const day = fullpath.substring(6,8);

    const date = new Date(year, month, day);

    return months[date.getMonth()];

}

export const getDate = (fullpath) => {
    //Do something with the input

    const year = fullpath.substring(0,4);
    const month = convertHumanMonthToInteger(fullpath.substring(4,6));
    const day = fullpath.substring(6,8);

    const date = new Date(year, month, day);

    return date.getDate();

}

export const getYear = (fullpath) => {
    const year = fullpath.substring(0,4);
    const month = convertHumanMonthToInteger(fullpath.substring(4,6));
    const day = fullpath.substring(6,8);

    const date = new Date(year, month, day);

    return date.getFullYear();

}

export const getMonthFromInteger = (monthInt) => {
    return months[monthInt];
}

export const getBedName = (bed_id) => {

    if (bed_id.includes("king")) {
        return "King";
    } else if (bed_id.includes("queen")) {
        return "Queen";
    } else if (bed_id.includes("bunk")) {
        return "Bunk Bed";
    } else if (bed_id.includes("couch")) {
        return "Couch";
    } else {
        return bed_id;
    }

}

export const isPastDate = (fullpath) => {

    const year = fullpath.substring(0,4);
    const month = convertHumanMonthToInteger(fullpath.substring(4,6));
    const day = fullpath.substring(6,8);

    const date = new Date(year, month, day).getTime();
    
    let dateObj = new Date();
    let now = dateObj.setDate(dateObj.getDate() - 1);

    return date < now;
    
}

export const convertHumanMonthToInteger = (month) => {

    if (month === 1) {
        return 0;
    } else if (month === 12) {
        return 11;
    } else {
        return month - 1;
    }

}