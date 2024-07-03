"use client";

import { signIn, useSession } from "next-auth/react";
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
		<div className="w-full bg-slate-800 text-white py-4 px-8 flex justify-between items-center fixed top-0 left-0 right-0">
			{!session ? (
				<>
					<h1 className="text-xl font-bold">Office Hour Queue</h1>

					<button
						onClick={() => signIn("github")}
						className=" bg-blue-500 hover:bg-blue-600 base-button"
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
							className="bg-blue-500  hover:bg-blue-600 base-button"
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
