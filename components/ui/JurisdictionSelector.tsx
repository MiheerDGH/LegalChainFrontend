import React, { useState, useEffect } from 'react';
import { countries, usStates } from '../../config/jurisdictionData';

type JurisdictionSelectorProps = {
  value: string; // The full jurisdiction string like "Texas, United States" or "India"
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

export default function JurisdictionSelector({
  value,
  onChange,
  required = false,
  className = '',
}: JurisdictionSelectorProps) {
  // Parse the current value to extract country and state
  const parseJurisdiction = (jurisdictionValue: string): { country: string; state: string } => {
    if (!jurisdictionValue) return { country: '', state: '' };
    
    // Check if it's a US state format: "State, United States"
    if (jurisdictionValue.includes(', United States')) {
      const state = jurisdictionValue.replace(', United States', '');
      return { country: 'United States', state };
    }
    
    // Otherwise it's just a country
    return { country: jurisdictionValue, state: '' };
  };

  const { country: initialCountry, state: initialState } = parseJurisdiction(value);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedState, setSelectedState] = useState(initialState);

  // Sync with external value changes
  useEffect(() => {
    const { country, state } = parseJurisdiction(value);
    setSelectedCountry(country);
    setSelectedState(state);
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    
    if (country === 'United States') {
      // Reset state selection when switching to US
      setSelectedState('');
      // Don't call onChange yet - wait for state selection
      onChange(''); // Clear value to trigger validation
    } else {
      // For non-US countries, set jurisdiction immediately
      setSelectedState('');
      onChange(country);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    // Combine state with country for US jurisdiction
    onChange(`${state}, United States`);
  };

  const showStateSelector = selectedCountry === 'United States';

  return (
    <div className={className}>
      <label className="block font-medium mb-1">
        Jurisdiction (Governing Law)
      </label>
      
      <div className="space-y-2">
        {/* Country Selector */}
        <select
          className="w-full border px-3 py-2 rounded-md"
          value={selectedCountry}
          onChange={handleCountryChange}
          required={required}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Selector (only for United States) */}
        {showStateSelector && (
          <select
            className="w-full border px-3 py-2 rounded-md"
            value={selectedState}
            onChange={handleStateChange}
            required={required}
          >
            <option value="">Select a state</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-1">
        {showStateSelector
          ? 'Select the state where the governing law applies.'
          : 'The legal jurisdiction whose laws apply to this agreement.'}
      </p>
    </div>
  );
}
