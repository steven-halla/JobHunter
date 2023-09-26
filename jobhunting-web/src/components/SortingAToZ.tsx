import React from "react";

interface SortingControlProps {
    sortOrder: 'a-z' | 'z-a';
    onSortOrderChange: () => void;
}

export const SortingAToZ: React.FC<SortingControlProps> = ({ sortOrder, onSortOrderChange }) => (
    <button onClick={onSortOrderChange}>Sort {sortOrder.toUpperCase()}</button>
);
