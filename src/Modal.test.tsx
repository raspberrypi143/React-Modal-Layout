import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Modal, { schemaOptions } from './Modal';

// Ensuring that the file is treated as a module
export {};

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    render(<Modal onClose={mockOnClose} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal with the correct initial state', () => {
    expect(screen.getByPlaceholderText('Enter the Name of the Segment')).toBeInTheDocument();
    expect(screen.getByText('Add schema to segment')).toBeInTheDocument();
    schemaOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('should add a selected schema to the blue box and remove it from the dropdown', () => {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.queryByText('First Name')).not.toBeInTheDocument(); // Ensure it's removed from dropdown
  });

  it('should allow changing a schema in the blue box and update available options', () => {
    // Add first schema
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));

    // Change the schema in the blue box
    const schemaDropdown = within(screen.getByText('First Name')).getByRole('combobox');
    fireEvent.change(schemaDropdown, { target: { value: 'last_name' } });

    expect(screen.queryByText('Last Name')).toBeInTheDocument();
    expect(screen.queryByText('First Name')).not.toBeInTheDocument();
  });

  it('should reset the dropdown after adding a schema', () => {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));

    const addSchemaDropdown = screen.getByRole('combobox');
    fireEvent.change(addSchemaDropdown, { target: { value: 'age' } });
    expect(addSchemaDropdown).toHaveValue('');
  });

  it('should submit the form and close the modal', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) });

    fireEvent.change(screen.getByPlaceholderText('Enter the Name of the Segment'), {
      target: { value: 'Test Segment' },
    });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));

    fireEvent.click(screen.getByText('Save the Segment'));

    expect(global.fetch).toHaveBeenCalledWith('https://webhook.site/your-webhook-url', expect.any(Object));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
