"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import UserSettingsModal from "./UserSettingsModal";

const Nav = () => {
	const { data: session } = useSession();
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
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
						<span>{session.user.name}</span>
						<button
							onClick={openModal}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							{session.user.email}
						</button>
					</div>
				</>
			)}

			{session && (
				<UserSettingsModal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
				/>
			)}
		</div>
	);
};

export default Nav;
