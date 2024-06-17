import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseDetails from "./CourseDetails";

const AdminCourseManagement = () => {
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [newCourseName, setNewCourseName] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await axios.get("/api/courses");
			setCourses(response.data.courses);
		} catch (error) {
			console.error("Error fetching courses:", error);
			if (error.response) {
				setError(error.response.data.error);
			}
		}
	};

	const createCourse = async () => {
		try {
			await axios.post("/api/courses", {
				name: newCourseName,
			});
			fetchCourses();
			setNewCourseName("");
		} catch (error) {
			console.error("Error creating course:", error);
			if (error.response) {
				setError(error.response.data.error);
			}
		}
	};

	const fetchCourseDetails = async (id) => {
		try {
			const response = await axios.get(`/api/courses/${id}`);
			setSelectedCourse(response.data.course);
		} catch (error) {
			console.error("Error fetching course details:", error);
			if (error.response) {
				setError(error.response.data.error);
			}
		}
	};

	return (
		<div className=" bg-slate-800 text-white p-8 rounded-lg mt-16 min-h-96">
			{!selectedCourse ? (
				<div className="flex flex-col space-y-4">
					<h1 className="text-3xl font-bold self-center">
						Admin Course Management
					</h1>

					<div className="flex flex-col space-y-2 bg-slate-700 base-button">
						<h2 className="text-2xl font-semibold self-center">
							Create New Course
						</h2>
						<div className="flex items-center space-x-2">
							<input
								type="text"
								value={newCourseName}
								onChange={(e) =>
									setNewCourseName(e.target.value)
								}
								placeholder="Course Name"
								className="bg-slate-900 p-2 rounded w-full"
							/>
							<button
								onClick={createCourse}
								className="bg-green-500 hover:bg-green-600 base-button"
							>
								Create
							</button>
						</div>
					</div>

					<div className="flex flex-col space-y-2">
						<h2 className="text-2xl font-semibold self-center">
							All Courses
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
							{courses.map((course) => (
								<button
									key={course._id}
									onClick={() =>
										fetchCourseDetails(course._id)
									}
									className="text-2xl bg-blue-500 hover:bg-blue-600 base-button"
								>
									{course.name}
								</button>
							))}
						</div>
					</div>

					{error && <p className="text-red-500 mb-4">{error}</p>}
				</div>
			) : (
				<CourseDetails
					selectedCourse={selectedCourse}
					setSelectedCourse={setSelectedCourse}
					fetchCourses={fetchCourses}
					fetchCourseDetails={fetchCourseDetails}
				/>
			)}
		</div>
	);
};

export default AdminCourseManagement;
