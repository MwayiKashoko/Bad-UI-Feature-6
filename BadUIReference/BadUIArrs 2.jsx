import * as badUI from "./BadUIComponents";

// Define mappings from feature name to component
const errorComponents = {
    Password: {
        UiErrorPassword: badUI.PasswordAlreadyInUse,
        UiErrorUsername: badUI.PasswordAlreadyInUse
    },

    Birthday: {
        UiErrorBirthday: badUI.BirthdayNeverAvailable
    },

    SecurePassword: {
        UiErrorPassword: badUI.ImpossiblePassword
    }
};

const captchaObj = {
    SimpleMathQuestions: {
        Captcha: badUI.SimpleMathQuestion
    },

    GuessTheNumber: {
        Captcha: badUI.GuessTheNumber
    },

    TetrisMasterMode: {
        Captcha: badUI.TetrisGame
    },

    TetrisInvisibleMode: {
        Captcha: badUI.TetrisGame
    },

    TetrisSprint: {
        Captcha: badUI.TetrisGame
    },

    TetrisFast: {
        Captcha: badUI.TetrisGame
    },

    TetrisMarathon: {
        Captcha: badUI.TetrisGame
    }
}

const alternativeComponents = {
    PhoneNumberRange: {
        AlternativePhoneNumber: badUI.PhoneNumberRange
    },

    BirthdayGuesser: {
        AlternativeBirthday: badUI.BirthdayGuesser
    }
};

const setAllUI = (feature) => {
    // Get errors for this feature or empty object
    const errors = errorComponents[feature] || {};
    const captchas = captchaObj[feature] || {};
    const alternatives = alternativeComponents[feature] || {};

    // List all possible keys to ensure all exist
    const allKeys = [
        "UiErrorEmail", "UiErrorPassword", "UiErrorUsername",
        "UiErrorBirthday", "UiErrorPhoneNumber", "Captcha",
        "AlternativeEmail", "AlternativePassword", "AlternativeFirstName",
        "AlternativeLastName", "AlternativeUsername",
        "AlternativeBirthday", "AlternativePhoneNumber"
    ];

    // Build result, using mapped component or null
    const result = {};
    allKeys.forEach((key) => {
        result[key] = errors[key] || captchas[key] || alternatives[key] || null;
    });

    return result;
};

export default setAllUI;
