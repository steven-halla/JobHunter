import { useState } from 'react';

export const useInputFocus = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (value === '') {
            setIsFocused(false);
        }
    };

    // Add TypeScript annotation for the event parameter
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (e.target.value !== '') {
            setIsFocused(true);
        }
    };

    return { isFocused, value, handleFocus, handleBlur, handleChange };
};
