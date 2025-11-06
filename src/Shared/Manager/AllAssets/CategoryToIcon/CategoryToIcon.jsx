"use client";
import React, { useEffect } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Tooltips
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const CategoryToIcon = ({ category, onCategoryFetched }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch category icon
  const {
    data: AssetIconData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["AssetCategoryIcon", category.category_id],
    queryFn: () =>
      axiosPublic
        .get(`/AssetCategories/Icon/${category.category_id}`)
        .then((res) => res.data.data[0] || {}),
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  // Placeholder styles for loading
  const placeholderStyle =
    "w-12 h-12 flex items-center justify-center rounded-lg bg-gray-200 animate-pulse";


  // Notify parent with the fetched category
  useEffect(() => {
    if (AssetIconData) {
      onCategoryFetched?.({
        _id: AssetIconData._id,
        category_name: AssetIconData.category_name,
      });
    }
  }, [AssetIconData, onCategoryFetched]);


  return (
    <>
      <div
        id={`category-icon-${category.category_id}`}
        className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden shadow-sm cursor-pointer"
        style={{
          // Use fetched color if available, else fallback
          backgroundColor: AssetIconData?.icon_color ?? "#f3f3f3",
        }}
        data-tooltip-id={`tooltip-${category.category_id}`}
        data-tooltip-content={`${AssetIconData?.category_name ?? category.category_name
          } (${AssetIconData?.category_code ?? category.category_code})`}
      >
        {isLoading ? (
          <div className={placeholderStyle}></div>
        ) : AssetIconData?.icon_url ? (
          <img
            src={AssetIconData.icon_url}
            alt={AssetIconData.category_name ?? category.category_name}
            className="w-9 h-9 object-contain"
          />
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </div>

      {/* React Tooltip */}
      <Tooltip
        id={`tooltip-${category.category_id}`}
        place="top"
        effect="solid"
      />
    </>
  );
};

export default CategoryToIcon;
