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

export const lessees = [
    {
      user_email: "brennanj414@gmail.com",
      user_name: "John Brennan",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocLe1bqDTfA5vNQLPaOiNjEDkUcLh4lChLfA1diQJEQxNdM=s96-c",
    },
    {
      user_email: "fisherben09@gmail.com",
      user_name: "Ben Fisher",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocJv6jnyqtc7ZE0F6DZzUNPJMRrhJ1bcIvIJ_m95Yqxv=s96-c",
    },
    {
      user_email: "lvkordecki@gmail.com",
      user_name: "Lindsay Kordecki",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocJnOJvQcHc30DFsMTcpWox8RXOrKjypImbybGVn-hHA=s96-c",
    },
    {
      user_email: "storbecktelbe@gmail.com",
      user_name: "Telbe Storbeck",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocJb1r7fx5Hu2lik4JNi5wWa1H9HJy-aI98mi1as7h58AVI=s96-c",
    },
    {
      user_email: "sophia.menick@gmail.com",
      user_name: "Sophia Menick",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocK860Pus1yIIcrjEcz0v_3oeEBCQukncqnaL08sAUa1cw=s96-c",
    },
    {
      user_email: "ctraut22@gmail.com",
      user_name: "Catherine Traut",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocJ_bsYABo500D-45h9OXc4MTXm_4fPh655upuk35Dsj=s96-c",
    },
    {
      user_email: "mjacobson594@gmail.com",
      user_name: "Maggie Jacobson",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocIt_NJ9en74gavz0rU8HXvhCf4vh5vP7Q3aYB2obNE-=s96-c",
    },
    {
      user_email: "trautben@gmail.com",
      user_name: "Ben Traut",
      user_picture:
        "https://lh3.googleusercontent.com/a/ACg8ocIR0PO9Urgm7eHB_WxJS6NBIDQehSXwb7_j3XeZDIJa=s96-c",
    },
  ];

  export const userIsTenant = (user_email) => {

    const index = lessees.findIndex((lessee) => lessee.user_email === user_email);

    if (index === -1) {
        return false;
    } else {
        return true;
    }
  }