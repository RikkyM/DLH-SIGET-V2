// import React, { useState, useRef, useEffect } from "react";

// interface ComboboxOption {
//   value: string;
//   label: string;
// }

// interface ComboboxProps {
//   options: ComboboxOption[];
//   value?: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
// }

// const Combobox: React.FC<ComboboxProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder = "Pilih opsi...",
//   disabled = false,
//   className = "",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [highlightedIndex, setHighlightedIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const selectedOption = options.find((opt) => opt.value === value);

//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         setIsOpen(false);
//         setSearchTerm("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (isOpen) {
//       setHighlightedIndex(0);
//     }
//   }, [searchTerm, isOpen]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (disabled) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setIsOpen(true);
//         setHighlightedIndex((prev) =>
//           prev < filteredOptions.length - 1 ? prev + 1 : prev,
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (isOpen && filteredOptions[highlightedIndex]) {
//           onChange(filteredOptions[highlightedIndex].value);
//           setIsOpen(false);
//           setSearchTerm("");
//         }
//         break;
//       case "Escape":
//         setIsOpen(false);
//         setSearchTerm("");
//         break;
//     }
//   };

//   const handleOptionClick = (optionValue: string) => {
//     onChange(optionValue);
//     setIsOpen(false);
//     setSearchTerm("");
//     inputRef.current?.blur();
//   };

//   return (
//     <div ref={containerRef} className={`relative w-full ${className}`}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={isOpen ? searchTerm : selectedOption?.label || ""}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onFocus={() => !disabled && setIsOpen(true)}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           disabled={disabled}
//           className={`w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//             disabled ? "cursor-not-allowed bg-gray-100" : "bg-white"
//           }`}
//         />
//         <button
//           type="button"
//           onClick={() => !disabled && setIsOpen(!isOpen)}
//           disabled={disabled}
//           className="absolute top-1/2 right-2 -translate-y-1/2"
//         >
//           <svg
//             className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </button>
//       </div>

//       {isOpen && !disabled && (
//         <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option, index) => (
//               <div
//                 key={option.value}
//                 onClick={() => handleOptionClick(option.value)}
//                 className={`cursor-pointer px-4 py-2 ${
//                   index === highlightedIndex ? "bg-blue-100" : ""
//                 } ${
//                   option.value === value ? "bg-blue-50 font-semibold" : ""
//                 } hover:bg-blue-50`}
//               >
//                 {option.label}
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray-500">Tidak ada hasil</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Combobox;