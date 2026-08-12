import { useState } from 'react'

export function AutocompleteField({
  disabled = false,
  getOptionMeta,
  getOptionTitle,
  label,
  loading,
  name,
  onSearch,
  onSelect,
  options,
  placeholder,
  required = false,
  selectedLabel = '',
  value,
}) {
  const [inputValue, setInputValue] = useState(selectedLabel)
  const [open, setOpen] = useState(false)

  function handleChange(event) {
    const nextValue = event.target.value
    setInputValue(nextValue)
    setOpen(true)
    onSearch(nextValue)

    if (!nextValue) {
      onSelect(name, null)
    }
  }

  function handleSelect(option) {
    setInputValue(getOptionTitle(option))
    setOpen(false)
    onSelect(name, option)
  }

  const showOptions = open && !disabled && inputValue.length >= 2

  return (
    <div className="app-field autocomplete-field">
      <span>{label}</span>
      <input
        autoComplete="off"
        disabled={disabled}
        name={`${name}Search`}
        placeholder={placeholder}
        required={required && !value}
        type="search"
        value={inputValue}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120)
        }}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
      />
      <input name={name} type="hidden" value={value} readOnly />
      {showOptions ? (
        <div className="autocomplete-menu">
          {loading ? <p>Buscando...</p> : null}
          {!loading && options.length === 0 ? <p>Sin coincidencias</p> : null}
          {!loading
            ? options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                >
                  <strong>{getOptionTitle(option)}</strong>
                  <span>{getOptionMeta(option)}</span>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}
