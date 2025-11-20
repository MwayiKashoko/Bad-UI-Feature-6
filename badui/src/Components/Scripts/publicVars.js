export const random = (min, max) => {
    return Math.floor((max - min + 1) * Math.random()) + min;
};

export const isPasswordGood = (str) => {
    const errors = [];

    try {
        //const digits = [...str.matchAll(/[0-9]/g)].map((elem) => parseInt(elem[0]));

        //console.log(digits.reduce((prev, curr) => prev + curr));
    } catch (e) { }

    if (str.length <= 9) {
        errors.push("Password must be longer than 9 characters.");
    } else if (!/[A-Z]/.test(str)) {
        errors.push("Password must include an uppercase character.");
    } else if (!/[0-9]/.test(str)) {
        errors.push("Password must include a number.");
    } else if (!/[`~!@#$%^&*()\-=_+[\]{}\\|;':",./<>?]/.test(str)) {
        errors.push("Password must include a special character.");
    } else if (!/\$.*?\$.*\$.*\$.*\$.*/.test(str)) {
        errors.push("Password must contain the $ character at least 5 times");
    }

    let failed = errors.length > 0;

    if (!failed) {
        console.log("All good!");
    } else {
        console.log(errors[0]);
    }
};