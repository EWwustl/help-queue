import { useState } from "react";
import axios from "axios";
import Papa from "papaparse";

const AddUsers = ({ courseID, fetchCourseDetails }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("student");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [errors, setErrors] = useState([]);
	const [csvFile, setCsvFile] = useState(null);

	const handleFileUpload = (e) => {
		setCsvFile(e.target.files[0]);
	};

	async function tryPostUsers(users) {
		try {
			const response = await axios.post(
				`/api/courses/${courseID}/users`,
				{
					users,
				}
			);
			setMessage(response.data.message);
			if (response.data.errors) {
				setErrors(response.data?.errors);
			}
			fetchCourseDetails(courseID);
		} catch (error) {
			console.error("Error adding user(s): ", error);
			setError(error.response?.data?.error || "Error adding user(s)");
		} finally {
			setName("");
			setEmail("");
			setCsvFile(null);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");
		setErrors([]);

		if (csvFile) {
			Papa.parse(csvFile, {
				header: true,
				complete: async (results) => {
					const users = results.data
						.map((row) => ({
							name: row.name,
							email: row.email,
							role,
						}))
						.filter((user) => user.name && user.email); // filter out invalid entries;

					console.log("Parsed Users:", users);

					await tryPostUsers(users);
				},
				error: (error) => {
					console.error("Error parsing CSV file: ", error);
					setError("Error parsing CSV file");
				},
			});
		} else {
			const users = [{ name, email, role }];
			await tryPostUsers(users);
		}
	};

	return (
		<div className="flex flex-col space-y-4 bg-slate-700 p-4 rounded text-white">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<div className="flex items-center space-x-2">
					<label htmlFor="name" className="w-24">
						Name:
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required={!csvFile}
						disabled={csvFile}
						className="bg-slate-900 flex-grow base-button"
					/>
				</div>

				<div className="flex items-center space-x-2">
					<label htmlFor="email" className="w-24">
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required={!csvFile}
						disabled={csvFile}
						className="bg-slate-900 flex-grow base-button"
					/>
				</div>

				<div className="flex items-center space-x-2">
					<label htmlFor="role" className="w-24">
						Role:
					</label>
					<select
						id="role"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="bg-slate-900 flex-grow base-button"
					>
						<option value="student">Student</option>
						<option value="ta">TA</option>
						<option value="instructor">Instructor</option>
					</select>
				</div>

				<div className="flex items-center space-x-2">
					<label htmlFor="csvFile">
						Upload CSV (format: name,email):
					</label>
					<input
						type="file"
						id="csvFile"
						accept=".csv"
						onChange={handleFileUpload}
						className="bg-slate-900 flex-grow base-button"
					/>
				</div>

				<button
					type="submit"
					className="bg-green-500 hover:bg-green-600 base-button"
				>
					Add User(s)
				</button>
			</form>

			{message && <p className="text-green-500">{message}</p>}
			{error && <p className="text-red-500">{error}</p>}
			{errors.length > 0 && (
				<div className="text-red-500">
					<h4>Errors:</h4>
					<ul>
						{errors.map((err, index) => (
							<li key={index}>{err}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default AddUsers;
