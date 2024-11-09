import React from 'react';
import { Form, Input, Select, Button } from 'antd';

interface Field {
    name: string;
    label: string;
    type: 'input' | 'select';
    options?: { label: string; value: string }[];
    placeholder?: string;
    defaultValue?: string; 
}

interface SearchFormProps {
    fields: Field[];
    onSubmit: (values: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, onSubmit }) => {
    return (
        <Form layout="inline" onFinish={onSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {fields.map((field) => (
                <Form.Item 
                    label={field.label} 
                    key={field.name} 
                    name={field.name} 
                    initialValue={field.defaultValue}
                >
                    {field.type === 'input' ? (
                        <Input placeholder={field.placeholder || `${field.label.toLowerCase()}`} />
                    ) : (
                        <Select placeholder={field.placeholder || `${field.label.toLowerCase()}`}>
                            {field.options?.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            ))}
            <Form.Item>
                <Button type="primary" htmlType="submit">Search</Button>
            </Form.Item>
        </Form>
    );
};

export default SearchForm;
