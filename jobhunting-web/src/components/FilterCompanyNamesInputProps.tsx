import React, { useState, ChangeEvent } from 'react';

type FilterCompanyNamesInputProps = {
    onFilterChange: (filter: string) => void;
}

export const FilterCompanyNamesInput: React.FC<FilterCompanyNamesInputProps> = ({ onFilterChange }) => {
    const [filter, setFilter] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
        onFilterChange(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Type to filter..."
            value={filter}
            onChange={handleChange}
        />
    );
};
