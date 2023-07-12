import React from "react";

//change name from loginghelpter to something else
export interface CustomFormProps {
    children?: React.ReactNode;
    // include other props here if the Form component expects any
}

export interface CustomForm extends React.FC<CustomFormProps> {
    validateAll: () => void;
}

export interface CustomCheckButtonProps {
    children?: React.ReactNode;
    // include other props here if the CheckButton component expects any
}

export interface CustomCheckButton extends React.FC<CustomCheckButtonProps> {
    context: {
        _errors: any[]; // Adjust this to the actual type if known
    }
}
