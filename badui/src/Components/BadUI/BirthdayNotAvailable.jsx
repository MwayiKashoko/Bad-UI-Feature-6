import RegisterScreen from "../RegisterScreens/RegisterScreens";

const testFunction = () => {
    console.log(3);
}

const BirthdayNeverAvailable = () => {
    return <RegisterScreen onClick={testFunction} />
}

export default BirthdayNeverAvailable;