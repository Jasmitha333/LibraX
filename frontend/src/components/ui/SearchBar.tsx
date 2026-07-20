import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({
  placeholder,
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );
}

export default SearchBar;