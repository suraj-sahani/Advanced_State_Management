'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function Combobox<
  T extends Array<{ value: string; label: string; name?: string }>
>(props: {
  options: T;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
}) {
  const { value } = props;
  const [inputValue, setInputValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);

  function handleChange(value: string) {
    setInputValue(value);
    props.onChange?.(value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {inputValue ? (
            props.options.find((option) => option.value === inputValue)?.label
          ) : (
            <span className="text-muted-foreground">{props.placeholder}</span>
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={props.placeholder}
            value={inputValue}
            onValueChange={handleChange}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    handleChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <input type="hidden" name={props.name} value={inputValue ?? ''} />
    </Popover>
  );
}
