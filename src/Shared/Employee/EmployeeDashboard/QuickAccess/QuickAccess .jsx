// Next Components
import { useRouter } from "next/navigation";

// Icons
import { BsReceipt } from "react-icons/bs";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";

const QuickAccess = () =>{
  const router = useRouter();

  // Quick access buttons
  const buttons = [
    {
      name: "Asset Recept",
      icon: <BsReceipt size={24} />,
      path: "/Employee/AssetRecept",
    },
    {
      name: "My Assets",
      icon: <LuUserRoundCheck size={24} />,
      path: "/Employee/MyAssets",
    },
    {
      name: "My Requests",
      icon: <IoReceiptOutline size={24} />,
      path: "/Employee/MyRequests",
    },
  ];

  return (
    <div className="mt-6">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quick Access</h3>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {buttons.map((btn) => (
          <button
            key={btn.name}
            onClick={() => router.push(btn.path)}
            className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 text-gray-800 font-semibold text-center"
          >
            {/* Icon */}
            <div className="text-blue-500">{btn.icon}</div>

            {/* Name */}
            <span className="text-base">{btn.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
