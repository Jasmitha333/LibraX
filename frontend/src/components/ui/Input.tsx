type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 px-4 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );
}

export default Input;