import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from './textfield';
import { PropsOf } from '@emotion/react';
import { Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export interface SimpleAutocompleteOption {
  label: string;
  value: string;
}

export interface SimpleTextfieldAutocompleteProps {
  options: SimpleAutocompleteOption[];
  label: string;
  value: string;
  onChange: (value: string) => void;
  textfieldProps?: PropsOf<typeof TextField>;
}

export const SimpleTextfieldAutocomplete: React.FC<
  SimpleTextfieldAutocompleteProps
> = ({ options, label, value, onChange, textfieldProps }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.find((option) => option.value === value)}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue.value);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} {...textfieldProps} />
      )}
    />
  );
};

export interface CheckboxAutocompleteProps {
  options: SimpleAutocompleteOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  inputProps?: PropsOf<typeof TextField>;
}

export const CheckboxAutocomplete: React.FC<CheckboxAutocompleteProps> = ({
  options,
  value,
  onChange,
  inputProps,
}) => {
  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.label}
      disableCloseOnSelect
      value={
        value
          ? options.filter((option) => value.includes(option.value))
          : undefined
      }
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.label}
        </li>
      )}
      onChange={(_, newValue) => {
        if (onChange) {
          onChange(newValue.map((option) => option.value));
        }
      }}
      renderInput={(params) => <TextField {...params} {...inputProps} />}
    />
  );
};

export { Autocomplete };
