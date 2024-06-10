"use client";

import axios from "axios";
import { useState, useEffect } from "react";

const CourseQueue = ({ params }) => {
	const [course, setCourse] = useState(null);
	const [error, setError] = useState(null);
	const id = params.id;

	useEffect(() => {
		if (id) {
			async function fetchCourse() {
				try {
					const response = await axios.get(`/api/courses/${id}`);
					setCourse(response.data.course);
				} catch (error) {
					console.error("Failed to fetch course", error);
					setError(error.message);
				}
			}

			fetchCourse();
		}
	}, [id]);

	if (error) {
		return (
			<p className="flex items-center justify-center min-h-screen bg-slate-600 text-red-500">
				{error}
			</p>
		);
	}

	if (!course) {
		return (
			<p className="flex items-center justify-center min-h-screen bg-slate-600 text-white">
				Loading...
			</p>
		);
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-slate-600 text-white p-4">
			<h1 className="text-3xl mb-4">
				Queue Panel for Course: {course.name}
			</h1>
			<h2 className="text-2xl m-2">Features to implement:</h2>
			<ul className="list-disc list-inside">
				<li>Students should be able to join the queue</li>
				<li>
					Students should be able to view their position in the queue
				</li>
				<li>
					Instructors & TAs should be able to manage the queue (in
					management panel){" "}
				</li>
				<li>
					Notifications for students when they become 1st in the
					queue?
				</li>
			</ul>
		</main>
	);
};

export default CourseQueue;
