import { useState, useEffect } from "react";
import axios from "axios";
import CourseDetails from "./CourseDetails";
import Courses from "./Courses";
import JoinCourse from "./JoinCourse";
import CourseQueues from "./CourseQueues";

const UserCourseManagement = ({ userID }) => {
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [userRole, setUserRole] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchJoinedCourses();
	}, [userID]);

	const fetchJoinedCourses = async () => {
		try {
			const response = await axios.get(`/api/users/${userID}/courses`);
			setCourses(response.data.courses);
		} catch (error) {
			console.error("Error fetching joined courses: ", error);
			setError(
				error.response?.data?.error || "Error fetching joined courses"
			);
		}
	};

	const fetchCourseDetails = async (id) => {
		try {
			const response = await axios.get(`/api/courses/${id}`);
			setSelectedCourse(response.data.course);

			// determine the user's role in the course
			const user = response.data.course.users.find(
				(u) => u.user.toString() === userID
			);
			setUserRole(user.role);
		} catch (error) {
			console.error("Error fetching course details:", error);
			setError(
				error.response?.data?.error || "Error fetching course details"
			);
		}
	};

	const goBack = () => {
		fetchJoinedCourses();
		setSelectedCourse(null);
	};

	return (
		<div className="bg-slate-800 text-white p-8 rounded-lg mt-16 min-h-96">
			{!selectedCourse ? (
				<div className="flex flex-col space-y-4">
					<JoinCourse
						userID={userID}
						fetchCourses={fetchJoinedCourses}
					/>

					<Courses
						courses={courses}
						fetchCourseDetails={fetchCourseDetails}
					>
						Joined Courses
					</Courses>

					{error && <p className="text-red-500">{error}</p>}
				</div>
			) : (
				<>
					{userRole === "instructor" ? (
						<CourseDetails
							selectedCourse={selectedCourse}
							setSelectedCourse={setSelectedCourse}
							fetchCourses={fetchJoinedCourses}
							fetchCourseDetails={fetchCourseDetails}
						/>
					) : (
						<div className="flex flex-col space-y-4 min-h-96 min-w-[48rem]">
							<div className="flex items-center justify-between">
								<button
									onClick={goBack}
									className="bg-slate-500 hover:bg-slate-600 base-button"
								>
									Go Back
								</button>
								<h2 className="text-2xl font-semibold">
									<b>{selectedCourse.name}</b>
								</h2>
							</div>

							<h2 className="text-2xl font-semibold self-center">
								Queues
							</h2>

							<CourseQueues
								courseID={selectedCourse._id}
								userRole={userRole}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default UserCourseManagement;
