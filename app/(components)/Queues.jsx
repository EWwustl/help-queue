import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateQueue from "./CreateQueue";
import StudentQueue from "./StudentQueue";
import ManageQueue from "./ManageQueue";

const Queues = ({ courseID, userRole }) => {
	const [queues, setQueues] = useState([]);
	const [selectedQueue, setSelectedQueue] = useState(null);
	const [error, setError] = useState("");

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

	const toggleQueueStatus = async (queueID) => {
		setError("");

		try {
			await axios.patch(`/api/courses/${courseID}/queues/${queueID}`);
			fetchQueues();
		} catch (error) {
			console.error("Error toggling queue status:", error);
			setError(
				error.response?.data?.error ||
					"Error toggling queue active status"
			);
		}
	};

	const deleteQueue = async (queueID) => {
		setError("");

		try {
			await axios.delete(`/api/courses/${courseID}/queues/${queueID}`);
			fetchQueues();
		} catch (error) {
			console.error("Error deleting queue:", error);
			setError(error.response?.data?.error || "Error deleting queue");
		}
	};

	const renderQueues = () => {
		return queues.map((queue) => (
			<div key={queue._id} className="base-button">
				<div className="flex justify-between items-center">
					{queue.isActive ? (
						<button
							className="text-2xl bg-blue-500 hover:bg-blue-600 base-button"
							onClick={() => setSelectedQueue(queue)}
						>
							{queue.name}
						</button>
					) : (
						<span className="text-2xl line-through base-button">
							{queue.name}
						</span>
					)}

					{userRole !== "student" && (
						// TAs and intructors can set active status
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

							{userRole === "instructor" && (
								// intructors can delete queues
								<button
									onClick={() => deleteQueue(queue._id)}
									className="bg-red-500 hover:bg-red-600 base-button"
								>
									✖
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		));
	};

	const renderQueueComponent = () => {
		if (userRole === "student") {
			return (
				<StudentQueue
					fetchQueues={fetchQueues}
					courseID={courseID}
					selectedQueue={selectedQueue}
					setSelectedQueue={setSelectedQueue}
				/>
			);
		}

		return (
			<ManageQueue
				fetchQueues={fetchQueues}
				courseID={courseID}
				selectedQueue={selectedQueue}
				setSelectedQueue={setSelectedQueue}
			/>
		);
	};

	return (
		<div className="flex flex-col space-y-4">
			{error && <p className="text-red-500">{error}</p>}

			{selectedQueue ? (
				renderQueueComponent()
			) : (
				<>
					{userRole === "instructor" && (
						// instructors can create queues
						<CreateQueue
							courseID={courseID}
							fetchQueues={fetchQueues}
						/>
					)}
					<div className="max-h-72 overflow-y-auto space-y-2">
						{queues.length === 0 ? (
							<p>Loading... (or no queues yet)</p>
						) : (
							renderQueues()
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Queues;
