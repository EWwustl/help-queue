// components/CourseQueues.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseQueues = ({ courseID }) => {
	const [queues, setQueues] = useState([]);
	const [error, setError] = useState("");
	const [newQueueName, setNewQueueName] = useState("");

	useEffect(() => {
		fetchQueues();
	}, [courseID]);

	const fetchQueues = async () => {
		setError("");
		try {
			const response = await axios.get(`/api/courses/${courseID}/queues`);
			setQueues(response.data.queues);
		} catch (error) {
			console.error("Error fetching queues:", error);
			setError(error.response?.data?.error || "Error fetching queues");
		}
	};

	const addQueue = async () => {
		setError("");
		try {
			await axios.post(`/api/courses/${courseID}/queues`, {
				name: newQueueName,
			});
			fetchQueues();
			setNewQueueName("");
		} catch (error) {
			console.error("Error adding queue:", error);
			setError(error.response?.data?.error || "Error adding queue");
		} finally {
			setNewQueueName("");
		}
	};

	const toggleQueueStatus = async (queueId) => {
		setError("");
		try {
			await axios.patch(`/api/courses/${courseID}/queues/${queueId}`);
			fetchQueues();
		} catch (error) {
			console.error("Error toggling queue status:", error);
			setError(
				error.response?.data?.error ||
					"Error toggling queue active status"
			);
		}
	};

	const deleteQueue = async (queueId) => {
		setError("");
		try {
			await axios.delete(`/api/courses/${courseID}/queues/${queueId}`);
			fetchQueues();
		} catch (error) {
			console.error("Error deleting queue:", error);
			setError(error.response?.data?.error || "Error deleting queue");
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-2 bg-slate-700 base-button">
				<h2 className="text-2xl font-semibold self-center">
					Create New Queue
				</h2>
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={newQueueName}
						onChange={(e) => setNewQueueName(e.target.value)}
						placeholder="Queue Name"
						className="bg-slate-900 flex-grow base-button"
					/>
					<button
						onClick={addQueue}
						className="bg-green-500 hover:bg-green-600 base-button"
					>
						Create
					</button>
				</div>
			</div>

			{error && <p className="text-red-500">{error}</p>}

			{queues.map((queue) => (
				<div key={queue._id} className="base-button">
					<div className="flex justify-between items-center">
						<span
							className={`cursor-pointer text-center ${
								!queue.isActive && "line-through"
							}`}
						>
							{queue.name}
						</span>
						<div className="flex space-x-2">
							<button
								onClick={() => toggleQueueStatus(queue._id)}
								className={`base-button ${
									queue.isActive
										? "bg-green-500 hover:bg-green-600"
										: "bg-gray-500 hover:bg-gray-600"
								}`}
							>
								{queue.isActive ? "Active" : "Inactive"}
							</button>
							<button
								onClick={() => deleteQueue(queue._id)}
								className="bg-red-500 hover:bg-red-600 base-button"
							>
								✖
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CourseQueues;
