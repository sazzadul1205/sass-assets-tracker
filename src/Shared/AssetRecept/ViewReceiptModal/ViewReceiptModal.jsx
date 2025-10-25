import React, { useRef } from "react";

// Packages
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

// Icons
import { ImCross } from "react-icons/im";
import { FaClipboardList } from "react-icons/fa";

const ViewReceiptModal = ({ UserData, selectedAsset, setSelectedAsset }) => {
  const receiptRef = useRef();

  // Close Modal
  const handleClose = () => {
    setSelectedAsset(null);
    document.getElementById("View_Receipt_Modal")?.close();
  };

  // PDF Generation Function (A4 version - properly scaled)
  const generatePDF = async () => {
    // Check if receiptRef is available
    if (!receiptRef.current) return;

    // Generate PDF
    try {
      // Convert HTML to image
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        backgroundColor: "#ffffff", // force white background
        cacheBust: true,
      });

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const img = new Image();

      // Add image to PDF
      img.onload = () => {
        const pageWidth = 210;  // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10;      // 10mm margin

        // Scale image to fit within page width (keeping aspect ratio)
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (img.height * imgWidth) / img.width;

        // Center vertically if image is shorter than page
        const yOffset = imgHeight < pageHeight - margin * 2
          ? (pageHeight - imgHeight) / 2
          : margin;

        // Add image to PDF
        pdf.addImage(img, "PNG", margin, yOffset, imgWidth, imgHeight);
        pdf.save(`Asset_Receipt_${selectedAsset?.receipt?._id || "document"}.pdf`);
      };

      // Load image
      img.src = dataUrl;
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // Check if selectedAsset has a receipt
  const receipt = selectedAsset?.receipt;
  if (!receipt) return null;

  // Calculate total price
  const totalPrice = receipt.recept_items?.reduce(
    (sum, item) => sum + parseFloat(item.price || 0),
    0
  );

  return (
    <div
      id="View_Receipt_Modal"
      className="modal-box w-full max-w-5xl mx-auto max-h-[90vh] bg-white rounded-2xl shadow-lg p-6 text-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">

        {/* Receipt Title */}
        <div className="flex items-center gap-3">
          {/* Receipt Icon */}
          <FaClipboardList className="text-blue-600 text-2xl" />

          {/* Receipt Title */}
          <h2 className="text-2xl font-bold text-gray-800">Asset Receipt</h2>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 transition-colors"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Receipt Content */}
      <div
        ref={receiptRef}
        className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm"
      >
        {/* Company Info */}
        <div className="text-center border-b pb-4 mb-6">
          {/* Company Name */}
          <h3 className="text-3xl font-bold text-gray-800">{UserData?.organization}</h3>

          {/* Company Address */}
          <p className="text-sm text-gray-600">
            {UserData?.address}, {UserData?.city}, {UserData?.country}
          </p>

          {/* Contact Info */}
          <p className="text-sm text-gray-600">{UserData?.email} | {UserData?.phone}</p>

          {/* Generated Date */}
          <p className="text-xs text-gray-500 mt-1">
            Generated on {new Date(receipt.generated_at).toLocaleString()}
          </p>
        </div>

        {/* User + Requester + Asset Info (Mapped & Compressed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
          {[
            {
              title: "Receiver Info",
              data: [
                { label: "Name", value: UserData?.name },
                { label: "Designation", value: UserData?.designation },
                { label: "Org", value: UserData?.organization },
                { label: "Email", value: UserData?.email },
                { label: "Phone", value: UserData?.phone },
              ],
            },
            {
              title: "Requester Info",
              data: [
                { label: "Name", value: selectedAsset?.requester_name },
                { label: "Email", value: selectedAsset?.requester_email },
                { label: "Phone", value: selectedAsset?.requester_phone_number },
                { label: "Ref", value: selectedAsset?.attachment_reference_id },
                {
                  label: "Status",
                  value: (
                    <span
                      className={`${selectedAsset?.status === "Completed"
                        ? "text-green-600 font-semibold"
                        : "text-gray-700"
                        }`}
                    >
                      {selectedAsset?.status}
                    </span>
                  ),
                },
              ],
            },
          ].map((section, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-md p-3 bg-gray-50"
            >
              {/* Section Title */}
              <h4 className="text-base font-semibold border-b pb-1 mb-2 text-gray-700">
                {section.title}
              </h4>

              {/* Section Data */}
              <div className="space-y-1">
                {section.data.map((item, j) => (
                  <p key={j}>
                    <strong>{item.label}:</strong> {item.value || "—"}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Asset Details */}
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mb-6">

          {/* Asset Details Title */}
          <h4 className="text-lg font-semibold border-b pb-1 mb-3 text-gray-700">
            Asset Details
          </h4>

          {/* Asset Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {/* Asset Name */}
            <p>
              <strong>Asset Name:</strong> {receipt.asset_name}
            </p>

            {/* Asset ID */}
            <p>
              <strong>Asset ID:</strong> {receipt.asset_id}
            </p>

            {/* Asset Category */}
            <p>
              <strong>Category:</strong> {receipt.asset_category}
            </p>

            {/* Asset Condition */}
            <p>
              <strong>Condition:</strong> {receipt.current_condition}
            </p>

            {/* Received By */}
            <p>
              <strong>Received By:</strong> {receipt.received_by}
            </p>

            {/* Handover Date */}
            <p>
              <strong>Handover Date:</strong>{" "}
              {new Date(receipt.handover_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Receipt Items */}
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mb-6">
          {/* Receipt Items Title */}
          <h4 className="text-lg font-semibold border-b pb-1 mb-3 text-gray-700">
            Receipt Breakdown
          </h4>

          {/* Receipt Items */}
          <table className="w-full text-sm border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b text-gray-700">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Price ($)</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {receipt.recept_items?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none text-gray-800"
                >
                  {/* Table Index */}
                  <td className="py-1">{index + 1}</td>

                  {/* Table Description */}
                  <td className="py-1">{item.description}</td>

                  {/* Table Price */}
                  <td className="py-1 text-right">
                    {parseFloat(item.price).toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Table Total */}
              <tr className="font-semibold text-gray-800 border-t">

                {/* Table Total Label */}
                <td colSpan="2" className="text-right py-2">
                  Total
                </td>

                {/* Table Total Price */}
                <td className="text-right py-2">
                  {totalPrice.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks */}
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          {/* Remarks Title */}
          <h4 className="text-lg font-semibold border-b pb-1 mb-2 text-gray-700">
            Remarks
          </h4>

          {/* Remarks */}
          <p className="text-sm text-gray-700">
            {receipt.remarks || "No remarks provided."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-600 pt-6 space-y-6 text-xs sm:text-sm">
          {/* Signature Section */}
          <div className="flex flex-col sm:flex-row justify-between text-center sm:text-left gap-6">
            {/* Receiver Signature */}
            <div className="flex-1">
              {/* Divider */}
              <p className="border-b border-gray-400 w-48 mx-auto sm:mx-0"></p>

              {/* Signature Label */}
              <p className="mt-1 font-medium text-gray-700">Receiver Signature</p>

              {/* Receiver Name */}
              <p className="text-gray-400 text-xs">
                ({UserData?.name || "Receiver Name"})
              </p>
            </div>

            {/* Requester Signature */}
            <div className="flex-1">
              {/* Divider */}
              <p className="border-b border-gray-400 w-48 mx-auto sm:mx-0"></p>

              {/* Signature Label  */}
              <p className="mt-1 font-medium text-gray-700">Requester Signature</p>

              {/* Requester Name */}
              <p className="text-gray-400 text-xs">
                ({selectedAsset?.requester_name || "Requester Name"})
              </p>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-center border-t pt-4 space-y-1">

            {/* Validation Note */}
            <p className="text-gray-500">
              This document requires authorized signatures for validation.
            </p>

            {/* Generated By */}
            <p className="italic text-gray-400">
              Generated by{" "}
              <span className="font-medium text-gray-600">SASS Asset Tracker</span>
            </p>

            {/* Copyright */}
            <p>© {new Date().getFullYear()} {UserData?.organization}. All rights reserved.</p>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="modal-action flex justify-end">
        <button
          type="button"
          onClick={generatePDF}
          className="px-5 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Print / Download Receipt
        </button>
      </div>
    </div>
  );
};

export default ViewReceiptModal;
