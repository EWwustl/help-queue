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
			className="bg-slate-700 text-white p-6 rounded-lg flex flex-col space-y-4"
			overlayClassName="modal-overlay"
		>
			<h2 className="text-xl font-semibold self-center">User Settings</h2>

			<input
				type="text"
				value={name}
				onChange={handleNameChange}
				className="p-2 bg-slate-900 rounded w-full "
			/>

			{error && <p className="text-red-500">{error}</p>}

			<div className="flex space-x-4">
				<button
					onClick={handleNameUpdate}
					className="bg-green-500 hover:bg-green-600 base-button"
					disabled={loading}
				>
					{loading ? "Updating..." : "Update Name"}
				</button>
				<button
					onClick={onRequestClose}
					className=" bg-slate-500 hover:bg-slate-600 base-button"
				>
					Cancel
				</button>
				<button
					onClick={() => signOut({ callbackUrl: "/" })}
					className=" bg-red-500 hover:bg-red-600 base-button"
				>
					Sign out
				</button>
			</div>
		</Modal>
	);
};

export default UserSettingsModal;
