import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCourseManagement = () => {
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [newCourseName, setNewCourseName] = useState("");
	const [updatedCourseName, setUpdatedCourseName] = useState("");

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await axios.get("/api/courses");
			setCourses(response.data.courses);
		} catch (error) {
			console.error("Error fetching courses:", error);
		}
	};

	const createCourse = async () => {
		try {
			const response = await axios.post("/api/courses", {
				name: newCourseName,
			});
			fetchCourses();
			setNewCourseName("");
		} catch (error) {
			console.error("Error creating course:", error);
		}
	};

	const fetchCourseDetails = async (id) => {
		try {
			const response = await axios.get(`/api/courses/${id}`);
			setSelectedCourse(response.data.course);
			setUpdatedCourseName(response.data.course.name);
		} catch (error) {
			console.error("Error fetching course details:", error);
		}
	};

	const updateCourse = async (id) => {
		try {
			await axios.put(`/api/courses/${id}`, { name: updatedCourseName });
			setSelectedCourse(null);
			fetchCourses();
		} catch (error) {
			console.error("Error updating course:", error);
		}
	};

	const deleteCourse = async (id) => {
		try {
			await axios.delete(`/api/courses/${id}`);
			setSelectedCourse(null);
			fetchCourses();
		} catch (error) {
			console.error("Error deleting course:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-8">
			<h1 className="text-3xl font-bold mb-8">Admin Course Management</h1>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">
					Create a New Course
				</h2>
				<input
					type="text"
					value={newCourseName}
					onChange={(e) => setNewCourseName(e.target.value)}
					placeholder="Course Name"
					className="bg-gray-800 p-2 rounded w-full mb-4 text-white"
				/>
				<button
					onClick={createCourse}
					className="bg-blue-500 hover:bg-blue-600 base-button"
				>
					Create Course
				</button>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">All Courses</h2>
				<div className="space-y-2">
					{courses.map((course) => (
						<button
							key={course._id}
							onClick={() => fetchCourseDetails(course._id)}
							className="w-full text-left bg-blue-500 hover:bg-blue-600 base-button"
						>
							{course.name}
						</button>
					))}
				</div>
			</div>

			{selectedCourse && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">
						Course Details
					</h2>
					<p className="mb-4">
						Name: <b>{selectedCourse.name}</b>
					</p>
					<p className="mb-4">
						Student Join Code:{" "}
						<b>{selectedCourse.studentJoinCode}</b>
					</p>
					<p className="mb-4">
						TA Join Code: <b>{selectedCourse.taJoinCode}</b>
					</p>
					<p className="mb-4">
						Instructor Join Code:{" "}
						<b>{selectedCourse.instructorJoinCode}</b>
					</p>
					<input
						type="text"
						value={updatedCourseName}
						onChange={(e) => setUpdatedCourseName(e.target.value)}
						placeholder="Updated Course Name"
						className="bg-gray-800 p-2 rounded w-full mb-4 text-white"
					/>
					<button
						onClick={() => updateCourse(selectedCourse._id)}
						className="bg-green-500 hover:bg-green-600 base-button mr-4"
					>
						Update Course
					</button>
					<button
						onClick={() => deleteCourse(selectedCourse._id)}
						className="bg-red-500 hover:bg-red-600 base-button"
					>
						Delete Course
					</button>
				</div>
			)}
		</div>
	);
};

export default AdminCourseManagement;
