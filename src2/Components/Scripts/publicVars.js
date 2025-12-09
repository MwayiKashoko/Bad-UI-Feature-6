export let isAbleToAuthenticate = false;

export const setIsAbleToAuthenticate = (val) => {
    isAbleToAuthenticate = val;
}

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

export const expandBinomial = (a, b, n) => {
    const coeffs = [];

    for (let k = 0; k <= n; k++) {
        const binom = combination(n, k); // nCk
        let coef = binom * (a ** (n - k)) * (b ** k);

        const xPower = n - k;
        const yPower = k;

        let term = '';

        // Only add coefficient if it's not 1 or -1 (except if the term is constant)
        const isConstant = xPower === 0 && yPower === 0;
        if ((coef !== 1 && coef !== -1) || isConstant) {
            term += coef;
        } else if (coef === -1) {
            term += '-';
        }

        // x term
        if (xPower === 1) term += 'x';
        else if (xPower > 1) term += `x^${xPower}`;

        // y term
        if (yPower === 1) term += 'y';
        else if (yPower > 1) term += `y^${yPower}`;

        coeffs.push(term);
    }

    return coeffs.join(' + ').replace(/\+\s-/g, '- ');
};

// nCk
const combination = (n, k) => {
    let num = 1, den = 1;
    for (let i = 1; i <= k; i++) {
        num *= (n - (i - 1));
        den *= i;
    }
    return num / den;
};