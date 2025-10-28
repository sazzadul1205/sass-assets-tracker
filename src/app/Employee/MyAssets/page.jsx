// src/app/Employee/MyAssets/page.jsx
"use client";

// React components
import { useState } from 'react';

// Next Auth
import { useSession } from 'next-auth/react';


// Icons
import { FaWallet } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';

// Packages
import { useQuery } from '@tanstack/react-query';


// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import TableItem from '@/Shared/Employee/MyAssets/TableItems/TableItems';


// Modal
import ViewRequestModal from '@/Shared/Employee/MyAssets/ViewRequestModal/ViewRequestModal';


// Options
const priorities = ["Low", "Medium", "High", "Urgent"];
const statuses = ["Pending", "Completed", "Rejected", "Canceled", "Accepted", "Working On"];
const mainCategories = ["Laptop", "Desktop", "Smartphone", "Tablet", "Printer", "Scanner", "Camera", "Monitor", "Keyboard", "Mouse"];
const categories = ["Laptop", "Desktop", "Smartphone", "Tablet", "Printer", "Scanner", "Camera", "Monitor", "Keyboard", "Mouse", "Other"];

const MyAssetsPage = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Select State
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchAssetName, setSearchAssetName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [searchRequestedBy, setSearchRequestedBy] = useState("");

  // Fetch requests
  const {
    data: RequestsData,
    error: RequestsError,
    isLoading: RequestsIsLoading
  } = useQuery({
    queryKey: ["RequestsData", session?.user?.email],
    queryFn: () =>
      axiosPublic.get(`/Requests/Created_by/${session?.user?.email}`)
        .then(res => res.data.requests),
    enabled: !!session?.user?.email,
    keepPreviousData: true,
  });


  // Loading state
  if (RequestsIsLoading || status === "loading") return <Loading />;

  // Error state
  if (RequestsError) {
    console.error(RequestsError);
    const errorMessage =
      typeof RequestsError === "string"
        ? RequestsError
        : RequestsError?.response?.data?.message || RequestsError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }

  // Apply filters
  const filteredData = RequestsData?.filter(asset => {
    // Matches Requester Name
    const matchesRequestedBy = asset.requester_name.toLowerCase().includes(searchRequestedBy.toLowerCase());

    // Matches Asset Name
    const matchesAssetName = asset.asset_name.toLowerCase().includes(searchAssetName.toLowerCase());

    // Matches Category
    const matchesCategory = selectedCategory
      ? selectedCategory === "Other"
        ? !mainCategories.includes(asset.asset_category)
        : asset.asset_category === selectedCategory
      : true;

    // Matches Priority
    const matchesPriority = selectedPriority ? asset.priority === selectedPriority : true;

    // Matches Status
    const matchesStatus = selectedStatus ? asset.status === selectedStatus : true;

    // Apply all filters
    return matchesRequestedBy && matchesAssetName && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaWallet size={28} className="text-blue-600" />
            My Assets
          </h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            Manage and view all your assets in one place
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Use the filters to search and narrow down assets.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 py-4 px-5 border border-gray-200 text-black bg-white">

        {/* Requested By Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-2">Requested By</label>
          <input
            type="text"
            placeholder="Search Requested By"
            value={searchRequestedBy}
            onChange={e => setSearchRequestedBy(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Asset Name Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-2">Asset Name</label>
          <input
            type="text"
            placeholder="Search Asset Name"
            value={searchAssetName}
            onChange={e => setSearchAssetName(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Priority Dropdown Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-2">Priority</label>
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>


      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Requested By</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Asset Name</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Asset ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Condition</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Priority</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map(asset =>
                <TableItem
                  key={asset._id}
                  asset={asset}
                  setSelectedAsset={setSelectedAsset}
                />)
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
    </div>
  );
};

export default MyAssetsPage;
