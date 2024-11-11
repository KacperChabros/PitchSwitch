import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Checkbox } from 'antd';
import { FaSearch } from 'react-icons/fa';

interface Field {
    name: string;
    label: string;
    type: 'input' | 'select' | 'date' | 'checkbox';
    options?: { label: string; value: string }[];
    placeholder?: string;
    defaultValue?: string | boolean;
}

interface SearchFormProps {
    fields: Field[];
    onSubmit: (values: any, pageNumber: number) => void;
    totalPages: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, onSubmit, totalPages, currentPage, onPageChange }) => {
    const [pageNumber, setPageNumber] = useState(currentPage);

    const handleFormSubmit = (values: any) => {
        onSubmit(values, pageNumber);
    };

    const handleNextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber((prev) => prev + 1);
            onPageChange(pageNumber + 1);
            form.submit();
        }
    };

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber((prev) => prev - 1);
            onPageChange(pageNumber - 1);
            form.submit();
        }
    };

    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
            }}
        >
            {fields.map((field) => (
                <Form.Item
                    label={field.label}
                    key={field.name}
                    name={field.name}
                    initialValue={field.defaultValue}
                    valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: '200px',
                        marginBottom: '4px',
                    }}
                >
                    {field.type === 'input' ? (
                        <Input placeholder={field.placeholder || `${field.label.toLowerCase()}`} style={{ width: '100%' }} />
                    ) : field.type === 'select' ? (
                        <Select
                            showSearch
                            placeholder={field.placeholder || `${field.label.toLowerCase()}`}
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="children"
                        >
                            {field.options?.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : field.type === 'date' ? (
                        <DatePicker
                            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
                            style={{ width: '100%' }}
                        />
                    ) : field.type === 'checkbox' ? (
                        <Checkbox>{field.label}</Checkbox>
                    ) : null}
                </Form.Item>
            ))}

            <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit">
                    <FaSearch /> Search
                </Button>
            </Form.Item>

            <div className="flex items-center justify-center gap-4 w-full">
                <Button 
                    onClick={handlePreviousPage} 
                    disabled={pageNumber === 1} 
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </Button>
                
                <span className="text-lg font-semibold text-gray-700">Page {pageNumber}</span>
                
                <Button 
                    onClick={handleNextPage} 
                    disabled={pageNumber >= totalPages} 
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </Button>
            </div>
        </Form>
    );
};

export default SearchForm;

