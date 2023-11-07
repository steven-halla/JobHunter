import { useState, useEffect } from 'react';

// Define the types for sortOrder and selectValue for better type checking.
type SortOrder =
    | 'select'
    | 'company-a-z'
    | 'company-z-a'
    | 'contact-a-z'
    | 'contact-z-a'
    | 'date-asc'
    | 'date-desc'
    | 'accepted'
    | 'declined'
    | 'no response'
    | 'delete'
    | 'update'
    | 'rejected-yes'
    | 'rejected-no';

// Defining the type for selectValue for better type checking.
export type SelectValue = 'select' | 'accepted' | 'declined' | 'no response' | 'delete' | 'update';

// Custom hook for handling sort orders.
export const useSortAndSelect = (initialSortOrder: SortOrder = 'select', initialSelectValue: SelectValue = 'select') => {
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [selectValue, setSelectValue] = useState<SelectValue>(initialSelectValue);

    const handleDateSortAsc = () => setSortOrder('date-asc');
    const handleDateSortDesc = () => setSortOrder('date-desc');
    const handleContactNameSortAsc = () => setSortOrder('contact-a-z');
    const handleContactNameSortDesc = () => setSortOrder('contact-z-a');
    const handleCompanyNameSortAsc = () => setSortOrder('company-a-z');
    const handleCompanyNameSortDesc = () => setSortOrder('company-z-a');

    // Handler for select value changes
    const handleSelectChange = (value: SelectValue) => setSelectValue(value);

    useEffect(() => {
        switch (selectValue as SortOrder) {
            case 'date-asc':
                // Sorting logic for date ascending
                break;
            case 'date-desc':
                // Sorting logic for date descending
                break;
            case 'company-a-z':
                // Sorting logic for company name ascending
                break;
            case 'company-z-a':
                // Sorting logic for company name descending
                break;
            case 'contact-a-z':
                // Sorting logic for contact name ascending
                break;
            case 'contact-z-a':
                // Sorting logic for contact name descending
                break;
            case 'rejected-yes':
                // Sorting logic for rejected-yes
                break;
            case 'rejected-no':
                // Sorting logic for rejected-no
                break;
            default:
                break;
        }
    }, [selectValue]);


    // You can include additional logic or handlers if needed.

    return {
        sortOrder,
        setSortOrder,
        selectValue,
        handleDateSortAsc,
        handleDateSortDesc,
        handleContactNameSortAsc,
        handleContactNameSortDesc,
        handleCompanyNameSortAsc,
        handleCompanyNameSortDesc,
        handleSelectChange,
    };
};
