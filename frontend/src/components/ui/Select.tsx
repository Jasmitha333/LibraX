type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
};

function Select({
  label,
  value,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-11 px-4 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;