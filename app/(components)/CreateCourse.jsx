import { useState } from "react";
import axios from "axios";

const CreateCourse = ({ fetchCourses }) => {
	const [newCourseName, setNewCourseName] = useState("");
	const [error, setError] = useState("");

	const createCourse = async () => {
		setError("");

		try {
			await axios.post("/api/courses", {
				name: newCourseName,
			});
			fetchCourses();
		} catch (error) {
			console.error("Error creating course: ", error);
			setError(error.response?.data?.error || "Error creating course");
		} finally {
			setNewCourseName("");
		}
	};

	return (
		<div className="flex flex-col space-y-2 bg-slate-700 base-button">
			<h2 className="text-2xl font-semibold self-center">
				Create New Course
			</h2>
			<div className="flex items-center space-x-2">
				<input
					type="text"
					value={newCourseName}
					onChange={(e) => setNewCourseName(e.target.value)}
					placeholder="Course Name"
					className="bg-slate-900 base-button w-full"
				/>
				<button
					onClick={createCourse}
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Create
				</button>
			</div>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default CreateCourse;
