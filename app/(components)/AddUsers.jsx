import { useState } from "react";
import axios from "axios";

const AddUsers = ({ courseID, fetchCourseDetails }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("student");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			const response = await axios.post(
				`/api/courses/${courseID}/users`,
				{
					name,
					email,
					role,
				}
			);

			setMessage(response.data.message);

			fetchCourseDetails(courseID);
		} catch (error) {
			console.error("Error adding user: ", error);
			setError(error.response?.data?.error || "Error adding user");
		} finally {
			setName("");
			setEmail("");
		}
	};

	return (
		<div className="flex flex-col space-y-4 bg-slate-700 p-4 rounded">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<div className="flex flex-col space-y-2">
					<label htmlFor="name" className="text-white">
						Name:
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="bg-slate-900 p-2 rounded w-full text-white"
					/>
				</div>
				<div className="flex flex-col space-y-2">
					<label htmlFor="email" className="text-white">
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-slate-900 p-2 rounded w-full text-white"
					/>
				</div>
				<div className="flex flex-col space-y-2">
					<label htmlFor="role" className="text-white">
						Role:
					</label>
					<select
						id="role"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="bg-slate-900 p-2 rounded w-full text-white"
					>
						<option value="student">Student</option>
						<option value="ta">TA</option>
						<option value="instructor">Instructor</option>
					</select>
				</div>
				<button
					type="submit"
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Add User
				</button>
			</form>

			{message && <p className="text-green-500">{message}</p>}
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default AddUsers;
