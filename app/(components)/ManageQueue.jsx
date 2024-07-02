import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageQueue = ({
	fetchQueues,
	courseID,
	selectedQueue,
	setSelectedQueue,
}) => {
	const [students, setStudents] = useState([]);
	const [error, setError] = useState("");
	const intervalInSeconds = 10; // poll every 10 seconds

	useEffect(() => {
		fetchStudents();
		const interval = setInterval(fetchStudents, intervalInSeconds * 1000);

		return () => clearInterval(interval);
	}, [selectedQueue]);

	const fetchStudents = async () => {
		setError("");

		try {
			const response = await axios.get(
				`/api/courses/${courseID}/queues/${selectedQueue._id}/students`
			);
			setStudents(response.data.students);
		} catch (error) {
			console.error("Error fetching students:", error);
			setError(error.response?.data?.error || "Error fetching students");
		}
	};

	const nextStudent = async () => {
		setError("");

		if (students.length === 0) return; // no students, nothing happens

		const currentStudent = students[0]._id;
		try {
			await axios.delete(
				`/api/courses/${courseID}/queues/${selectedQueue._id}/students`,
				{ data: { userID: currentStudent } }
			);
			fetchStudents();
		} catch (error) {
			console.error("Error moving to next student:", error);
			setError(
				error.response?.data?.error || "Error moving to next student"
			);
		}
	};

	const goBack = () => {
		fetchQueues();
		setSelectedQueue(null);
	};

	return (
		<div className="flex flex-col space-y-4">
			<button
				onClick={goBack}
				className="bg-slate-500 hover:bg-slate-600 base-button"
			>
				Go Back to All Queues
			</button>

			<h2 className="text-2xl self-center">
				Manage - <b>{selectedQueue.name}</b>
			</h2>

			<p>
				This page automatically polls the newest queue every{" "}
				{intervalInSeconds} seconds.
			</p>

			{students.length > 0 ? (
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl">Current Student:</h3>

						<div className="bg-white px-8 py-6 rounded text-blue-500">
							<b>{students[0].name}</b>
						</div>

						<button
							onClick={nextStudent}
							className="bg-blue-500 hover:bg-blue-600 base-button"
						>
							Next Student
						</button>
					</div>

					<h3 className="text-xl">All Students:</h3>

					<ul className="max-h-24 overflow-y-auto">
						{students.map((student, index) => (
							<li key={student._id} className="base-button">
								{index + 1}. {student.name}
							</li>
						))}
					</ul>
				</div>
			) : (
				<p>No students in the queue.</p>
			)}

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default ManageQueue;
