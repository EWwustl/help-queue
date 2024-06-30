import { useState } from "react";
import axios from "axios";

const JoinCourse = ({ userID, fetchCourses }) => {
	const [joinCode, setJoinCode] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleJoinCourse = async () => {
		setMessage("");
		setError("");

		try {
			const response = await axios.post(`/api/users/${userID}/courses`, {
				joinCode,
			});
			setMessage(response.data.message);
			fetchCourses();
		} catch (error) {
			console.error("Error joining course: ", error);
			setError(error.response?.data?.error || "Error joining course");
		} finally {
			setJoinCode("");
		}
	};

	return (
		<div className="flex flex-col space-y-2 bg-slate-700 base-button">
			<h2 className="text-2xl font-semibold self-center">
				Join a Course
			</h2>
			<div className="flex items-center space-x-2">
				<input
					type="text"
					value={joinCode}
					onChange={(e) => setJoinCode(e.target.value)}
					placeholder="Enter join code"
					className="bg-slate-900 base-button w-full"
				/>
				<button
					onClick={handleJoinCourse}
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Join
				</button>
			</div>

			{message && <p className="text-green-500">{message}</p>}
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default JoinCourse;
