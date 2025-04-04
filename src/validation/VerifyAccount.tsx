import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiBaseUrl from "../config/axiosConfig";

const VerifyAccount = () => {
  const [message, setMessage] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await apiBaseUrl.get(`/user/verify-email?token=${token}`);

        // Save token & user data to localStorage (simulate login)
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setMessage("Email verified");
        // Redirect to dashboard (or home)
        setTimeout(() => {
          window.close();
        }, 2000);
      } catch (error) {
        setMessage("Verification failed. The link may have expired.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setMessage("No verification token found.");
      setLoading(false);
    }
  }, [token, apiBaseUrl]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        {loading ? (
          <p className="text-gray-500">Verifying...</p>
        ) : (
          <h2 className="text-xl font-semibold">{message}</h2>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
