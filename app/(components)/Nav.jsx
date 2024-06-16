"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const Nav = () => {
	const { data: session } = useSession();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [name, setName] = useState(session?.user.name || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		Modal.setAppElement("#__next");
	}, []);

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
		setError("");
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleNameUpdate = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await axios.post("/api/updateUser", {
				email: session.user.email,
				name,
			});

			if (res.status === 200) {
				// Update the session with the new name
				session.user.name = name;
				closeModal();
			} else {
				setError("Failed to update name. Please try again.");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full bg-gray-800 text-white py-4 px-8 flex justify-between items-center fixed top-0 left-0 right-0">
			{!session ? (
				<>
					<h1 className="text-xl font-bold">Office Hour Queue</h1>
					<button
						onClick={() => signIn("github")}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Sign in with GitHub
					</button>
				</>
			) : (
				<>
					<h1 className="text-xl font-bold">
						Welcome, {session.user.role}
					</h1>
					<div className="flex items-center space-x-4">
						<span>{session.user.email}</span>
						<button
							onClick={openModal}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							{session.user.email}
						</button>
					</div>
				</>
			)}

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
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
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						disabled={loading}
					>
						{loading ? "Updating..." : "Update Name"}
					</button>
					<button
						onClick={closeModal}
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
		</div>
	);
};

export default Nav;
