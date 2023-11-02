import React, {useCallback, useState} from "react";
import "./Button.scss";
interface ButtonProps {
    buttonOneClick: () => void;
    buttonTwoClick: () => void;
    labelOne: string;
    labelTwo: string;
}

export const Button: React.FC<ButtonProps> = ({ buttonOneClick, buttonTwoClick, labelOne, labelTwo }) => {
    const [isButtonOneActive, setIsButtonOneActive] = useState(true);

    const handleButtonOneClick = useCallback(() => {
        buttonOneClick();
        setIsButtonOneActive(true);
    }, [buttonOneClick]);

    const handleButtonTwoClick = useCallback(() => {
        buttonTwoClick();
        setIsButtonOneActive(false);
    }, [buttonTwoClick]);

    return (
        <>
            <div className={"button-container"}>
                <button           className={`button ${isButtonOneActive ? "button-active" : ""}`}
                                   onClick={handleButtonOneClick}>
                    {labelOne}
                </button>
                <button          className={`button ${!isButtonOneActive ? "button-active" : ""}`}
                                 onClick={handleButtonTwoClick}>
                    {labelTwo}
                </button>
            </div>
        </>

    );
};
