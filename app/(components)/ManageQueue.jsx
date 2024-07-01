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

	useEffect(() => {
		fetchStudents();
		const interval = setInterval(fetchStudents, 10000); // poll every 10 seconds

		return () => clearInterval(interval);
	}, [selectedQueue]);

	const fetchStudents = async () => {
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
		if (students.length === 0) return;
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
				Go Back to Queues
			</button>

			<h2 className="text-2xl">
				Manage - <b>{selectedQueue.name}</b>
			</h2>

			{students.length > 0 ? (
				<div>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<h3 className="text-xl">Current Student:</h3>
							<div className="bg-white px-8 py-6 rounded text-blue-500">
								<b>{students[0].name}</b>
							</div>
						</div>

						<button
							onClick={nextStudent}
							className="bg-blue-500 hover:bg-blue-600 base-button"
						>
							Next Student
						</button>
					</div>

					<h3 className="text-xl mt-4">Queue:</h3>

					<ul>
						{students.slice(1).map((student, index) => (
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
