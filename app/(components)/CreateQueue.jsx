import { useState } from "react";
import axios from "axios";

const CreateQueue = ({ courseID, fetchQueues }) => {
	const [newQueueName, setNewQueueName] = useState("");
	const [error, setError] = useState("");

	const createQueue = async () => {
		setError("");

		try {
			await axios.post(`/api/courses/${courseID}/queues`, {
				name: newQueueName,
			});
			fetchQueues();
		} catch (error) {
			console.error("Error adding queue:", error);
			setError(error.response?.data?.error || "Error adding queue");
		} finally {
			setNewQueueName("");
		}
	};

	return (
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
					className="bg-slate-900 base-button w-full"
				/>
				<button
					onClick={createQueue}
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Create
				</button>
			</div>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default CreateQueue;
