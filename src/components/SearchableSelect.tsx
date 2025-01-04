import React, { useState } from "react";

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  selectedValue: Option;
  onChange: (selectedOption: Option) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, selectedValue, onChange }) => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearch(""); // Limpia el campo de búsqueda después de seleccionar
  };

  return (
    <div className="searchable-select" style={{ position: "relative", width: "200px" }}>
      <input
        type="text"
        placeholder="Search..."
        value={search || selectedValue.label}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li style={{ padding: "8px", color: "#999" }}>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
