import { useState } from "react";
import axios from "axios";

const CourseInfo = ({
	selectedCourse,
	setSelectedCourse,
	fetchCourses,
	fetchCourseDetails,
}) => {
	const [updatedCourseName, setUpdatedCourseName] = useState("");
	const [error, setError] = useState("");

	const updateCourse = async (id) => {
		setError("");
		try {
			await axios.put(`/api/courses/${id}`, {
				name: updatedCourseName,
			});
			fetchCourseDetails(id);
		} catch (error) {
			console.error("Error updating course: ", error);
			setError(error.response?.data?.error || "Error updating course");
		} finally {
			setUpdatedCourseName("");
		}
	};

	const deleteCourse = async (id) => {
		setError("");
		try {
			await axios.delete(`/api/courses/${id}`);
			fetchCourses();
			setSelectedCourse(null);
		} catch (error) {
			console.error("Error deleting course: ", error);
			setError(error.response?.data?.error || "Error deleting course");
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-2 bg-slate-700 base-button">
				<h1 className="text-xl self-center">Join Codes</h1>
				<p>
					Student Code: <b>{selectedCourse.studentJoinCode}</b>
				</p>
				<p>
					TA Code: <b>{selectedCourse.taJoinCode}</b>
				</p>
				<p>
					Instructor Code: <b>{selectedCourse.instructorJoinCode}</b>
				</p>
			</div>

			<div className="flex items-center space-x-2">
				<input
					type="text"
					value={updatedCourseName}
					onChange={(e) => setUpdatedCourseName(e.target.value)}
					placeholder="New Course Name"
					className="bg-slate-900 p-2 rounded w-full text-white"
				/>
				<button
					onClick={() => updateCourse(selectedCourse._id)}
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Update
				</button>
			</div>

			{error && <p className="text-red-500">{error}</p>}

			<button
				onClick={() => deleteCourse(selectedCourse._id)}
				className="bg-red-500 hover:bg-red-600 base-button"
			>
				Delete Course
			</button>
		</div>
	);
};

export default CourseInfo;
