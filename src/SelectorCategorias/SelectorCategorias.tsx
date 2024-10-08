import React from 'react';
import Select from 'react-select';

type CategorySelectProps = {
    categories: string[];
    selectedCategory: string;
    onChange: (selectedCategory: string) => void;
};

function CategorySelect({ categories, selectedCategory, onChange }: CategorySelectProps) {
    const options = categories.map((category) => ({
        value: category,
        label: category,
    }));

    return (
        <Select
            value={{ value: selectedCategory, label: selectedCategory }}
            options={[
                { value: 'Todos', label: 'Todos' },
                ...options,
            ]}
            onChange={(selectedOption) => onChange(selectedOption!.value as string)}
        />
    );
}

export default CategorySelect;
