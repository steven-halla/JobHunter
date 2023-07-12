declare module 'react-validation';
declare module "react-validation/build/form";
declare module "react-validation/build/input";
declare module "react-validation/build/button";

declare module "react-validation/build/button" {
    import { ComponentType } from "react";

    const CheckButton: ComponentType<any>;
    export default CheckButton;
}



declare module "react-validation/build/form" {
    import { ComponentType } from "react";

    const Form: ComponentType<any>;
    export default Form;
}

