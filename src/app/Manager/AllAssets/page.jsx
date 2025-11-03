// src/app/Manager/AllAssets/page.jsx
"use client";


import SharedHeader from '@/Shared/SharedHeader/SharedHeader';
import React from 'react';
import { FaCubes } from 'react-icons/fa';

const page = () => {
  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<FaCubes size={28} className="text-blue-600" />} // icon is customizable
        title="All Assets"
        description="View and manage all company assets in one place."
        tip="Tip: Keep asset details updated for smooth tracking."
        buttonLabel="Add New Asset"
        onAddClick={() => document.getElementById("Add_New_Asset_Modal")?.showModal()}
      />
    </div>
  );
};

export default page;