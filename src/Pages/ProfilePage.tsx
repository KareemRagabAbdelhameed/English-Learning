import { useContext, useEffect, useState } from "react";
import apiBaseUrl from "../config/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/Context";

interface LovedVideo {
  id: string;
  title: string;
  url: string;
  lovedByCount: number;
  isYouTube?: boolean;
  thumbnail?: string;
  videoId?: string;
}

const ProfilePage = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [userAccountData, setUserAccountData] = useState({
        username: "",
        email: "",
        profilePicture: "",
    });

    const [lovedVideos, setLovedVideos] = useState<LovedVideo[]>([]);
    const [loading, setLoading] = useState(true);

    const extractVideoId = (url: string) => {
        if (url.includes('youtube.com')) {
            return url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be')) {
            return url.split('/').pop();
        }
        return null;
    };

    // fetch profile data
    useEffect(() => {
        const fetchedData = async () => {
            try {
                const response = await apiBaseUrl.get("/users/account", { withCredentials: true });
                setUserAccountData({
                    username: response.data.data.username,
                    email: response.data.data.email,
                    profilePicture: response.data.data.profilePicture,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchedData();
    }, []);

    // Fetch all loved videos
    useEffect(() => {
        const fetchLovedVideos = async () => {
            try {
                const response = await apiBaseUrl.get("/users/account/videos/loved", { withCredentials: true });
                const videos = (response.data.videos || []).map((video: LovedVideo) => {
                    const videoId = extractVideoId(video.url);
                    if (videoId) {
                        return {
                            ...video,
                            isYouTube: true,
                            videoId,
                            url: `https://www.youtube.com/embed/${videoId}`,
                            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                        };
                    }
                    return video;
                });
                setLovedVideos(videos);
            } catch (error) {
                console.error("Failed to fetch loved videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLovedVideos();
    }, []);

    const deleteAccount = async () => {
        try {
            const result = await Swal.fire({
                title: "Are you sure to delete your account?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await apiBaseUrl.delete(`/users/account`, { withCredentials: true });
                user?.setAuth({ email: "", id: "", name: "", role: "", profilePicture: { url: "" } });
                Swal.fire({
                    title: "Deleted!",
                    text: "Your account has been deleted.",
                    icon: "success",
                }).then(() => navigate("/"));
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Failed to Delete Account",
            });
        }
    };

    return (
        <div className="dark:bg-gray-600 dark:text-white min-h-screen">
            <div className="py-12 px-5 lg:py-24 lg:px-24">
                {/* Profile Section */}
                <div className="flex flex-col items-center space-y-6 lg:flex-row lg:items-center lg:space-x-20 lg:space-y-0">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full">
                        <img className="w-full h-full rounded-full" src={userAccountData.profilePicture} alt="" />
                    </div>
                    <div className="text-center lg:text-left">
                        <h1 className="text-lg md:text-xl font-bold mb-2">{userAccountData.username}</h1>
                        <p className="text-gray-500 dark:text-gray-200 md:text-lg mb-4">{userAccountData.email}</p>
                    </div>
                    <div className="flex space-x-4 justify-center lg:justify-start">
                        {/* <button className="flex p-2 bg-customBlue dark:bg-yellow-500 rounded-xl hover:rounded-3xl dark:hover:bg-yellow-600 transition-all duration-300 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button> */}
                        <button onClick={() => deleteAccount()} className="flex p-2 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Loved Videos Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">My Loved Videos</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : lovedVideos.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No loved videos yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lovedVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
                                >
                                    <div className="relative pt-[56.25%]">
                                        {video.isYouTube ? (
                                            <iframe
                                                src={video.url}
                                                title={video.title}
                                                className="absolute top-0 left-0 w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                controls
                                                poster={video.thumbnail}
                                            >
                                                <source src={video.url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-red-500">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span className="ml-2">{video.lovedByCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;