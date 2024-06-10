"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import axios from "axios";

const Courses = () => {
	const { data: session } = useSession();
	const [courses, setCourses] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (session) {
			async function fetchCourses() {
				try {
					const response = await axios.get("/api/courses");
					setCourses(response.data.courses);
				} catch (error) {
					console.error("Failed to fetch courses", error);
					setError(error.message);
				}
			}

			fetchCourses();
		}
	}, [session]);

	if (!session) {
		return null;
	}

	return (
		<div>
			<h1 className="text-2xl mb-4">Courses</h1>
			{error && <p className="text-red-500">{error}</p>}
			{courses.map((course) => (
				<CourseCard
					key={course._id}
					id={course._id}
					name={course.name}
				/>
			))}
		</div>
	);
};

export default Courses;
