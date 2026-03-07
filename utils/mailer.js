// pages/ProofUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Capacitor } from "@capacitor/core";

export default function ProofUpload() {
  const { token: rawToken } = useParams();
  // handle links coming from email or web / APK
  const token = rawToken?.split("/").pop();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ================= API BASE =================
  const apiBase =
    Capacitor.getPlatform() === "web"
      ? "http://localhost:5000"
      : "https://joblinkbackend.onrender.com";

  // ================= FETCH APPLICATION =================
  useEffect(() => {
    if (!token) return navigate("/");

    axios
      .get(`${apiBase}/api/applications/access/${token}`)
      .then((res) => setApplication(res.data))
      .catch(() => {
        alert("Invalid or expired link");
        navigate("/");
      });
  }, [token, apiBase, navigate]);

  // ================= UPLOAD TO CLOUDINARY =================
  const uploadToCloudinary = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        let response;
        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          return reject(new Error("Invalid response from Cloudinary"));
        }

        if (xhr.status !== 200 || !response.secure_url) {
          return reject(new Error(response.error?.message || "Upload failed"));
        }

        resolve(response.secure_url);
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  };

  // ================= HANDLE FORM SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile || !resumeFile) return alert("Please select both files");

    try {
      setLoading(true);
      setUploadProgress(0);

      const proofUrl = await uploadToCloudinary(proofFile, (p) => setUploadProgress(Math.round(p / 2)));
      const resumeUrl = await uploadToCloudinary(resumeFile, (p) => setUploadProgress(50 + Math.round(p / 2)));

      const res = await axios.post(`${apiBase}/api/applications/upload/cloud/${token}`, { proofUrl, resumeUrl });

      alert("Files uploaded successfully!");
      navigate(`/history/${res.data.publicToken}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // ================= LOADING / FALLBACK =================
  if (!application) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Proof & CV</h2>

      <p className="mb-4 text-gray-700">
        Hello <strong>{application.fullname}</strong>, upload your{" "}
        <strong>Proof of Payment</strong> and <strong>Resume/CV</strong> for{" "}
        <strong>{application.jobPosition}</strong>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Proof of Payment</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setProofFile(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Resume / CV</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            required
          />
        </div>

        {loading && (
          <>
            <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
              <div
                className="h-3 bg-green-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-center mt-1">Uploading... {uploadProgress}%</p>
          </>
        )}

        <button
          disabled={loading}
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 transition"
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

        <label className="text-sm mt-2 block">
          <input type="checkbox" required /> I agree to the{" "}
          <a href="/terms" className="text-green-600 underline">
            Terms & Conditions
          </a>
        </label>
      </form>
    </div>
  );
}