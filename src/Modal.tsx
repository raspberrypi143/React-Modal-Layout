import React, { useState } from 'react';
import './Modal.css';

interface SchemaOption {
  label: string;
  value: string;
}

export const schemaOptions: SchemaOption[] = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaOption[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string>('');

  const handleAddSchema = () => {
    if (currentSelection) {
      const selectedOption = schemaOptions.find(schema => schema.value === currentSelection);
      if (selectedOption) {
        setSelectedSchemas([...selectedSchemas, selectedOption]);
        setCurrentSelection(''); // Reset the dropdown selection
      }
    }
  };

  const handleSchemaChange = (index: number, value: string) => {
    const newSchemas = [...selectedSchemas];
    const newSchema = schemaOptions.find(option => option.value === value);

    if (newSchema) {
      newSchemas[index] = newSchema;
      setSelectedSchemas(newSchemas);
    }
  };

  // Filter out selected schemas from the available options
  const availableSchemas = schemaOptions.filter(
    option => !selectedSchemas.some(selected => selected.value === option.value)
  );

  const handleSubmit = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };

    fetch("https://webhook.site/your-webhook-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        onClose();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Saving Segment</h3>
        <input
          type="text"
          placeholder="Enter the Name of the Segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="segment-name-input"
        />
        <div className="schema-selector">
          {selectedSchemas.map((schema, index) => (
            <div key={index} className="schema-dropdown-container">
              <select
                value={schema.value}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
                className="schema-dropdown"
              >
                {schemaOptions
                  .filter(option => 
                    !selectedSchemas.some(s => s.value === option.value && s !== schema)
                  )
                  .map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          ))}

          {availableSchemas.length > 0 && (
            <>
              <select
                className="schema-dropdown"
                value={currentSelection}
                onChange={(e) => setCurrentSelection(e.target.value)}
              >
                <option value="" disabled>Add schema to segment</option>
                {availableSchemas.map(schema => (
                  <option key={schema.value} value={schema.value}>
                    {schema.label}
                  </option>
                ))}
              </select>
              <button className="add-schema-btn" onClick={handleAddSchema}>+Add new schema</button>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSubmit}>Save the Segment</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
