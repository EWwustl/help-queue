import React from "react";

const ManageQueue = ({ fetchQueues, selectedQueue, setSelectedQueue }) => {
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
		</div>
	);
};

export default ManageQueue;
