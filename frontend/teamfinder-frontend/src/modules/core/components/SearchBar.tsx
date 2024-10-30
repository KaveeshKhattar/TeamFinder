import { SearchBarProps } from "../../../types";

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onChange }) => {
    return (
        <div className="flex border-2 rounded-md mb-2">
            <i className="fa-solid fa-magnifying-glass m-2 text-black"></i>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full dark:text-black"
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;