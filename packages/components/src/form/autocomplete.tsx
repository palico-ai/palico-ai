/* eslint-disable @typescript-eslint/no-explicit-any */
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from './textfield';
import { PropsOf } from '@emotion/react';
import { Checkbox, ListItem } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export interface SimpleAutocompleteOption {
  label: string;
  value: any;
}

export interface CheckboxAutocompleteProps {
  options: SimpleAutocompleteOption[];
  value?: any[];
  onChange?: (value: any[]) => void;
  groupBy?: (option: SimpleAutocompleteOption) => string;
  inputProps?: PropsOf<typeof TextField>;
}

export const CheckboxAutocomplete: React.FC<CheckboxAutocompleteProps> = ({
  options,
  value,
  groupBy,
  onChange,
  inputProps,
}) => {
  console.log('checkbox value', value);
  return (
    <Autocomplete
      multiple
      options={options}
      groupBy={groupBy}
      getOptionLabel={(option) => option.label}
      disableCloseOnSelect
      value={
        value
          ? options.filter((option) => {
              const optionValueString = JSON.stringify(option.value).trim();
              const match = value.some((value) => {
                const valueString = JSON.stringify(value).trim();
                return valueString === optionValueString;
              });
              return match;
            })
          : undefined
      }
      renderOption={(props, option, { selected }) => {
        return (
          <ListItem {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </ListItem>
        );
      }}
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
