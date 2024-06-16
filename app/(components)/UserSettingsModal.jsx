import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

const UserSettingsModal = ({ isOpen, onRequestClose }) => {
	const { data: session } = useSession();
	const [name, setName] = useState(session.user.name);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleNameUpdate = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await axios.post("/api/updateUser", {
				id: session.user.id,
				name,
			});

			if (res.status === 200) {
				session.user.name = name;
				onRequestClose();
			} else {
				setError("Failed to update name.");
			}
		} catch (error) {
			setError("An error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="User Settings"
			className="modal-content"
			overlayClassName="modal-overlay"
		>
			<h2 className="text-xl mb-4">Update Name</h2>
			<input
				type="text"
				value={name}
				onChange={handleNameChange}
				className="mb-4 p-2 border rounded w-full"
			/>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<div className="flex justify-between">
				<button
					onClick={handleNameUpdate}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					disabled={loading}
				>
					{loading ? "Updating..." : "Update Name"}
				</button>
				<button
					onClick={onRequestClose}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					Cancel
				</button>
				<button
					onClick={() => signOut({ callbackUrl: "/" })}
					className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
				>
					Sign out
				</button>
			</div>
		</Modal>
	);
};

export default UserSettingsModal;
