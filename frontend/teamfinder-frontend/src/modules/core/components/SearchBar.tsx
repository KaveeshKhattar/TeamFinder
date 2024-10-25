import { SearchBarProps } from "../../../types";

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onChange }) => {
    return (
        <div className="flex border-2 bg-slate-100 rounded-md">
            <i className="fa-solid fa-magnifying-glass m-2 text-black"></i>
            <input
                type="text"
                placeholder={placeholder}
                className="bg-slate-100 w-full dark:text-black"
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;