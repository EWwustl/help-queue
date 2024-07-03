import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateCourse from "./CreateCourse";
import Courses from "./Courses";
import CourseDetails from "./CourseDetails";

const AdminCourseDashboard = () => {
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchAllCourses();
	}, []);

	const fetchAllCourses = async () => {
		setError("");

		try {
			const response = await axios.get("/api/courses");
			setCourses(response.data.courses);
		} catch (error) {
			console.error("Error fetching courses: ", error);
			setError(error.response?.data?.error || "Error fetching courses");
		}
	};

	const fetchCourseDetails = async (id) => {
		setError("");

		try {
			const response = await axios.get(`/api/courses/${id}`);
			setSelectedCourse(response.data.course);
		} catch (error) {
			console.error("Error fetching course details:", error);
			setError(
				error.response?.data?.error || "Error fetching course details"
			);
		}
	};

	return (
		<div className=" bg-slate-800 text-white p-8 rounded-lg min-h-96">
			{!selectedCourse ? (
				<div className="flex flex-col space-y-4">
					<h1 className="text-3xl font-bold self-center">
						Admin Course Dashboard
					</h1>

					<CreateCourse fetchCourses={fetchAllCourses} />

					<Courses
						courses={courses}
						fetchCourseDetails={fetchCourseDetails}
					>
						All Courses
					</Courses>

					{error && <p className="text-red-500">{error}</p>}
				</div>
			) : (
				<CourseDetails
					selectedCourse={selectedCourse}
					setSelectedCourse={setSelectedCourse}
					fetchCourses={fetchAllCourses}
					fetchCourseDetails={fetchCourseDetails}
				/>
			)}
		</div>
	);
};

export default AdminCourseDashboard;
