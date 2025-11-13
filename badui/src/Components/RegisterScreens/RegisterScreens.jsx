const RegisterScreen = (onClickFunction) => {
    return (
        <div>
            <label>Email: <input type="email" /></label> <br /> <br />
            <label>Username: <input /></label><br /> <br />
            <label>Password: <input type="password" /></label><br /> <br />
            <label>Birthday: <input type="date" /></label><br /> <br />
            <label>Phone Number: <input type="number" /></label> <br /> <br />
            <button onClick={onClickFunction.onClick}>Register</button>
        </div>
    );
}

export default RegisterScreen;