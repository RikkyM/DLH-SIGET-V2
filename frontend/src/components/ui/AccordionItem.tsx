import { useAuth } from "@/hooks/useAuth";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  title: string;
  routes: string[];
  children: ReactNode;
  defaultOpen?: boolean;
  allowedRoles?: string[];
};

const AccordionItem = ({
  title,
  children,
  routes,
  defaultOpen,
  allowedRoles,
}: Props) => {
  const location = useLocation();
  const { user } = useAuth();

  const hasPermission =
    !allowedRoles || (user && allowedRoles.includes(user.role));

  const isActiveRoute = routes.some((route) =>
    location.pathname.startsWith(route),
  );

//   const [isOpen, setIsOpen] = useState(defaultOpen || isActiveRoute);

//   useEffect(() => {
//     if (isActiveRoute) setIsOpen(true);
//     else setIsOpen(false);
//   }, [isActiveRoute]);

const [manualOpen, setManualOpen] = useState<boolean>(Boolean(defaultOpen));

const isOpen = isActiveRoute ? true : manualOpen;

if (!hasPermission) return null;

  return (
    <div className="whitespace-nowrap">
      <button
        onClick={() => setManualOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left transition-all duration-300 outline-none ${
          isActiveRoute
            ? "bg-gray-500/20 text-black shadow"
            : "hover:bg-gray-500/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`transition-opacity duration-250 lg:group-hover:opacity-100 outline-none font-medium`}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-clip transition-all duration-300 ${
          isOpen ? "max-h-170" : "max-h-0"
        }`}
      >
        <div className={`h-max space-y-2 pt-2 transition-all duration-250`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
