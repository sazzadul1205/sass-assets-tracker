// src/app/Employee/MyAssets/page.jsx
"use client";

// React components
import { useEffect, useState } from 'react';

// Next Auth
import { useSession } from 'next-auth/react';


// Icons
import { FaAngleLeft, FaAngleRight, FaEye, FaSearch, FaUserPlus, FaWallet } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';

// Packages
import { useQuery } from '@tanstack/react-query';


// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import CategoryToIcon from '@/Shared/Manager/AllAssets/CategoryToIcon/CategoryToIcon';
import AssetReturnTime from '@/Shared/Manager/AllAssets/AssetReturnTime/AssetReturnTime';

// Modal
import ViewAssetModal from '@/Shared/Manager/AllAssets/ViewAssetModal/ViewAssetModal';
import ViewRequestModal from '@/Shared/Employee/MyAssets/ViewRequestModal/ViewRequestModal';
import AssetServiceModal from '@/Shared/Employee/MyAssets/AssetServiceModal/AssetServiceModal';
import SharedHeader from '@/Shared/SharedHeader/SharedHeader';

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Select State
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch Users Data
  const {
    data: UsersData,
    error: UsersError,
    refetch: UsersRefetch,
    isLoading: UsersIsLoading,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // Fetch user assets with filters & pagination
  const {
    data: UsersAssetsData,
    error: UsersAssetsError,
    refetch: UsersAssetsRefetch,
    isLoading: UsersAssetsIsLoading,
  } = useQuery({
    queryKey: [
      "UsersAssetsData",
      session?.user?.email,
      currentPage,
      itemsPerPage,
      searchQuery,
      selectedCategory,
      selectedBrand,
      selectedCondition,
    ],
    queryFn: () => {
      if (!session?.user?.email) return Promise.resolve({ assets: [] });

      return axiosPublic
        .get(`/Assets/Email/${session.user.email}`, {
          params: {
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            brand: selectedBrand || undefined,
            condition: selectedCondition || undefined,
          },
        })
        .then(res => res.data);
    },
    keepPreviousData: true,
    enabled: !!session?.user?.email,
  });

  // Fetch Department Public with filters & pagination
  const {
    data: DepartmentPublicData,
    error: DepartmentPublicError,
    refetch: DepartmentPublicRefetch,
    isLoading: DepartmentPublicIsLoading,
  } = useQuery({
    queryKey: [
      "DepartmentPublicData",
      UsersData?.department_id,
      currentPage,
      itemsPerPage,
      searchQuery,
      selectedCategory,
      selectedBrand,
      selectedCondition,
    ],
    queryFn: () => {
      if (!UsersData?.department_id) return Promise.resolve({ assets: [] });

      return axiosPublic
        .get(`/Assets/DepartmentPublic/${UsersData.department_id}`, {
          params: {
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            brand: selectedBrand || undefined,
            condition: selectedCondition || undefined,
            includeAssigned: true,
          },
        })
        .then(res => res.data);
    },
    keepPreviousData: true,
    enabled: !!UsersData?.department_id,
  });

  // Fetch Categories
  const {
    data: CategoryData,
    error: CategoryError,
    refetch: CategoryRefetch,
    isLoading: CategoryIsLoading
  } = useQuery({
    queryKey: ["Category"],
    queryFn: () => axiosPublic.get(`/AssetCategories`).
      then(res => res.data.data),
    keepPreviousData: true,
  });

  // Fetch AssetsBrands
  const {
    data: AssetsBrandsData,
    error: AssetsBrandsError,
    refetch: AssetsBrandsRefetch,
    isLoading: AssetsBrandsIsLoading,
  } = useQuery({
    queryKey: ["AssetsBrandsData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/Brands`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Assets Condition
  const {
    data: AssetsConditionData,
    error: AssetsConditionError,
    refetch: AssetsConditionRefetch,
    isLoading: AssetsConditionIsLoading,
  } = useQuery({
    queryKey: ["AssetsConditionData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/Condition`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Merge and remove duplicates
  const unifiedAssets = [
    ...(UsersAssetsData?.assets || []),
    ...(DepartmentPublicData?.assets || []),
  ];

  const uniqueAssets = Array.from(
    new Map(unifiedAssets.map(item => [item._id, item])).values()
  );

  // Pagination logic
  const totalItems = uniqueAssets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedAssets = uniqueAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Refetch
  const Refetch = () => {
    UsersRefetch();
    CategoryRefetch();
    UsersAssetsRefetch();
    AssetsBrandsRefetch();
    AssetsConditionRefetch();
    DepartmentPublicRefetch();
    AssetCategoriesNamesRefetch();
  };

  // Auto refetch Assets on filter change
  useEffect(() => {
    setCurrentPage(1); // reset pagination when filters change
  }, [searchQuery, selectedCategory, selectedBrand, selectedCondition]);

  // Loading state
  if (
    CategoryIsLoading ||
    status === "loading" ||
    AssetsBrandsIsLoading ||
    AssetsConditionIsLoading
  ) return <Loading />;

  // Error state
  if (
    UsersError ||
    CategoryError ||
    UsersAssetsError ||
    AssetsBrandsError ||
    AssetsConditionError ||
    DepartmentPublicError
  ) {
    console.error("UsersError :", UsersError);
    console.error("CategoryError :", CategoryError);
    console.error("UsersAssets  Error :", UsersAssetsError);
    console.error("AssetsBrandsError :", AssetsBrandsError);
    console.error("AssetsConditionError :", AssetsConditionError);
    console.error("DepartmentPublicError :", DepartmentPublicError);

    return <Error errors={[
      UsersError,
      CategoryError,
      UsersAssetsError,
      AssetsBrandsError,
      AssetsConditionError,
      DepartmentPublicError,
    ]} />;
  }

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<FaWallet size={28} className="text-blue-600" />}
        title="My Assets"
        description="Manage and view all your assets in one place."
        tip="Tip: Use the filters to search and narrow down assets."
      />

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 p-5">
        {/* Search Box */}
        <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search by asset name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Brand Dropdown */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Brands</option>
          {[...new Set(AssetsBrandsData?.filter(Boolean))]?.map((brand, idx) => (
            <option key={idx} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Condition Dropdown */}
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Conditions</option>
          {[...new Set(AssetsConditionData?.filter(Boolean))]?.map((cond, idx) => (
            <option key={idx} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Categories</option>
          {/* Use all categories, not filtered assets */}
          {CategoryData?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto mt-4 relative">
        {UsersAssetsIsLoading || DepartmentPublicIsLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loading />
          </div>
        )}

        {/* Table */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Category", align: "left" },
                { label: "Asset Name", align: "left" },
                { label: "Brand", align: "left" },
                { label: "Condition", align: "left" },
                { label: "Warranty Period", align: "center" },
                { label: "Private / Public", align: "center" },
                { label: "Time", align: "center" },
                { label: "Actions", align: "center" },
              ].map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${col.align === "left" ? "text-left" : col.align === "center" ? "text-center" : "text-right"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedAssets && paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset, index) => (
                <TableContent
                  asset={asset}
                  index={index}
                  key={asset.asset_id || index}
                  setSelectedAsset={setSelectedAsset}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaBoxOpen className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-400 text-sm sm:text-base">
                      No assets found matching your criteria.
                    </p>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      Try adjusting your filters or adding new assets.
                    </p>
                  </div>
                </td>
              </tr>

            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-5">
          <div className="join shadow rounded-lg overflow-hidden">
            <button
              className={`join-item px-5 py-2 font-medium text-black bg-white border border-gray-300 rounded-l-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>

            <button className="join-item px-5 py-2 font-medium text-black bg-white border-none cursor-default" disabled>
              Page {currentPage} / {totalPages}
            </button>

            <button
              className={`join-item px-5 py-2 font-medium text-black bg-white border border-gray-300 rounded-r-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>

      {/* Create New Request Modal */}
      <dialog id="View_Request_Modal" className="modal">
        <ViewRequestModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* View Asset Modal */}
      <dialog id="View_Asset_Modal" className="modal">
        <ViewAssetModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* View Asset Modal */}
      <dialog id="Asset_Services_Modal" className="modal">
        <AssetServiceModal
          Refetch={Refetch}
          userData={UsersData}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Page;

const TableContent = ({ asset, setSelectedAsset }) => {
  return (
    <tr
      key={asset._id || index}
      className="border-t border-gray-200 hover:bg-gray-50 transition text-gray-900"
    >
      {/* Category Icon */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset?.category_id ? (
          <CategoryToIcon
            category={asset}
          />
        ) : (
          "—"
        )}
      </td>

      {/* Asset Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset.asset_name || "—"}
        <p className="text-xs text-gray-500" >{asset?.serial_number || "—"}</p>
      </td>

      {/* Brand Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset.brand_name || "—"}
      </td>

      {/* Condition */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.condition || "—"}
      </td>

      {/* Warranty Period */}
      <td className=" px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.warranty_period || "—"} Month's
        <p className="text-xs text-gray-500" >
          (   {new Date(asset.warranty_expiry_date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })})
        </p>
      </td>

      {/* Private / Public */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.isPrivate === false ? (
          <div className="inline-flex items-center gap-1 px-4 py-1 mx-auto rounded-lg bg-green-100 text-green-800 font-semibold text-sm">
            Public
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-4 py-1 mx-auto rounded-lg bg-blue-100 text-blue-800 font-semibold text-sm">
            Private
          </div>
        )}
      </td>

      {/* Time Left / Request Status */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.request ? (
          (() => {
            const statusMap = {
              pending_return: { text: "Return Requested", color: "bg-yellow-100 text-yellow-700" },
              pending_repair: { text: "Repair Requested", color: "bg-blue-100 text-blue-700" },
              pending_inspection: { text: "Inspection Requested", color: "bg-purple-100 text-purple-700" },
              pending_upgrade: { text: "Upgrade Requested", color: "bg-green-100 text-green-700" },
            };

            const { text, color } = statusMap[asset.request.status] || {
              text: asset.request.status,
              color: "bg-gray-100 text-gray-700",
            };

            return (
              <p className={`px-2 w-[200px] py-1 rounded-lg text-sm font-semibold ${color}`}>
                {text}
              </p>
            );
          })()
        ) : (
          <AssetReturnTime
            isLimited={asset?.isLimited}
            return_date={asset?.return_date}
          />
        )}
      </td>

      {/* Actions */}
      <td className="flex justify-center py-4 px-1 gap-3">
        {/* Return / Repair Button — disabled if there's already a request */}
        <button
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg 
            transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap min-w-[8rem] 
            ${asset?.request
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            }`}
          onClick={() => {
            if (!asset?.request) {
              setSelectedAsset(asset);
              document.getElementById("Asset_Services_Modal").showModal();
            }
          }}
          disabled={!!asset?.request}
        >
          <FaUserPlus className="text-base" />
          Asset Services
        </button>


        {/* View Button */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-500 
          text-white rounded-lg hover:bg-blue-600 transition-all duration-200 w-32 
          shadow-md hover:shadow-lg cursor-pointer "
          onClick={() => {
            setSelectedAsset(asset);
            document.getElementById("View_Asset_Modal").showModal();
          }}
        >
          <FaEye className="text-base" />
          View
        </button>
      </td>
    </tr>
  )
}