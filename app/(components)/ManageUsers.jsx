import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageUsers = ({ courseID }) => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchUsers();
	}, [courseID]);

	const fetchUsers = async () => {
		setError("");
		try {
			const response = await axios.get(`/api/courses/${courseID}/users`);
			setUsers(response.data.users);
		} catch (error) {
			console.error("Error fetching users: ", error);
			setError(error.response?.data?.error || "Error fetching users");
		}
	};

	const updateUserRole = async (userID, newRole) => {
		setError("");
		try {
			await axios.patch(`/api/courses/${courseID}/users/${userID}`, {
				role: newRole,
			});
			fetchUsers();
		} catch (error) {
			console.error("Error updating user role: ", error);
			setError(error.response?.data?.error || "Error updating user role");
		}
	};

	const handleRoleChange = (userID, e) => {
		const newRole = e.target.value;
		updateUserRole(userID, newRole);
	};

	const removeUser = async (userID) => {
		setError("");
		try {
			await axios.delete(`/api/courses/${courseID}/users/${userID}`);
			fetchUsers();
		} catch (error) {
			console.error("Error removing user: ", error);
			setError(error.response?.data?.error || "Error removing user");
		}
	};

	if (users.length === 0) {
		return <p>Loading... (or no users yet)</p>;
	}

	return (
		<div className="flex flex-col space-y-4 bg-slate-700 base-button">
			{error && <p className="text-red-500">{error}</p>}

			<table className="w-full text-white">
				<thead>
					<tr>
						<th className="text-left base-button">Name</th>
						<th className="text-left base-button">Email</th>
						<th className="text-left base-button">Role</th>
						<th className="text-left base-button">Remove</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr
							key={user.user._id}
							className="border-t border-slate-600"
						>
							<td className="base-button">{user.user.name}</td>
							<td className="base-button">{user.user.email}</td>
							<td className="base-button">
								<select
									value={user.role}
									onChange={(e) =>
										handleRoleChange(user.user._id, e)
									}
									className="bg-slate-900 p-2 rounded text-white"
								>
									<option value="student">Student</option>
									<option value="ta">TA</option>
									<option value="instructor">
										Instructor
									</option>
								</select>
							</td>
							<td className="base-button flex justify-center">
								<button
									onClick={() => removeUser(user.user._id)}
									className="bg-red-500 hover:bg-red-600 base-button"
								>
									✖
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ManageUsers;
