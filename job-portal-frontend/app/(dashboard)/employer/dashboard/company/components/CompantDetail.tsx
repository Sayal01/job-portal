import React, { useState, useEffect } from "react";

interface Company {
  company_name?: string;
  description?: string;
  website?: string;
  logo?: string;  // URL string for logo image
}

interface CompanyTabProps {
  company: Company;
}

const CompanyTab: React.FC<CompanyTabProps> = ({ company }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: company.company_name || "",
    description: company.description || "",
    website: company.website || "",
    logo: null as File | null,
  });

  useEffect(() => {
    setFormData({
      company_name: company.company_name || "",
      description: company.description || "",
      website: company.website || "",
      logo: null,
    });
    setLogoPreview(null);
  }, [company]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("company_name", formData.company_name);
      data.append("description", formData.description || "");
      data.append("website", formData.website || "");
      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const response = await fetch("/api/company/update", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to save company info");

      const result = await response.json();
      console.log("Saved data:", result);
      setIsEditing(false);
      setLogoPreview(null);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Company Details</h2>

      {/* Company Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="company_name">
          Company Name
        </label>
        {isEditing ? (
          <input
            id="company_name"
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-900 text-lg">{formData.company_name || "N/A"}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
          Description
        </label>
        {isEditing ? (
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{formData.description || "No description provided."}</p>
        )}
      </div>

      {/* Website */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="website">
          Website
        </label>
        {isEditing ? (
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        ) : formData.website ? (
          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {formData.website}
          </a>
        ) : (
          <p className="text-gray-500">No website provided.</p>
        )}
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="logo">
          Company Logo
        </label>
        {logoPreview ? (
          <img src={logoPreview} alt="Logo Preview" className="mb-2 h-24 w-24 object-contain border rounded" />
        ) : company.logo ? (
          <img src={company.logo} alt="Current Logo" className="mb-2 h-24 w-24 object-contain border rounded" />
        ) : (
          <p className="text-gray-500 mb-2">No logo uploaded.</p>
        )}
        {isEditing && (
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
                setLogoPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="border rounded p-1"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setLogoPreview(null);
              }}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Company Info
          </button>
        )}
      </div>
    </section>
  );
};

export default CompanyTab;
