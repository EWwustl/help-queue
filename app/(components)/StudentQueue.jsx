import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const StudentQueue = ({
	fetchQueues,
	courseID,
	selectedQueue,
	setSelectedQueue,
}) => {
	const { data: session } = useSession();
	const [students, setStudents] = useState([]);
	const [position, setPosition] = useState(0);
	const [isInQueue, setIsInQueue] = useState(false);
	const [error, setError] = useState("");
	const userID = session.user.id;
	const intervalInSeconds = 30; // poll every 30 seconds

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

			const userIndex = response.data.students.findIndex(
				(student) => student._id === userID
			);
			setPosition(userIndex + 1); // because userIndex starts at 0
			setIsInQueue(userIndex !== -1);
		} catch (error) {
			console.error("Error fetching students:", error);
			setError(error.response?.data?.error || "Error fetching students");
		}
	};

	const joinQueue = async () => {
		setError("");

		try {
			await axios.post(
				`/api/courses/${courseID}/queues/${selectedQueue._id}/students`,
				{ userID }
			);
			fetchStudents();
		} catch (error) {
			console.error("Error joining queue:", error);
			setError(error.response?.data?.error || "Error joining queue");
		}
	};

	const leaveQueue = async () => {
		setError("");

		try {
			await axios.delete(
				`/api/courses/${courseID}/queues/${selectedQueue._id}/students`,
				{ data: { userID } }
			);
			fetchStudents();
		} catch (error) {
			console.error("Error leaving queue:", error);
			setError(error.response?.data?.error || "Error leaving queue");
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

			<h2 className="text-2xl font-semibold self-center">
				{selectedQueue.name}
			</h2>

			<p>
				This page automatically polls the newest queue every{" "}
				{intervalInSeconds} seconds.
			</p>

			<p>There are {students.length} student(s) in the queue.</p>

			{position !== 0 && (
				<p
					className={`text-center ${
						position === 1 ? "text-4xl font-bold" : ""
					}`}
				>
					You are in position {position}.
				</p>
			)}

			{isInQueue ? (
				<button
					onClick={leaveQueue}
					className="bg-red-500 hover:bg-red-600 base-button"
				>
					Leave Queue
				</button>
			) : (
				<button
					onClick={joinQueue}
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Join Queue
				</button>
			)}

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default StudentQueue;
