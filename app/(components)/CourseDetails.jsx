import React, { useState } from "react";
import CourseInfo from "./CourseInfo";
import CourseQueues from "./CourseQueues";
import AddUsers from "./AddUsers";
import ManageUsers from "./ManageUsers";

const CourseDetails = ({
	selectedCourse,
	setSelectedCourse,
	fetchCourses,
	fetchCourseDetails,
}) => {
	const [selectedOption, setSelectedOption] = useState("courseInfo");

	const goBack = () => {
		fetchCourses();
		setSelectedCourse(null);
	};

	const renderComponent = () => {
		switch (selectedOption) {
			case "courseInfo":
				return (
					<CourseInfo
						selectedCourse={selectedCourse}
						setSelectedCourse={setSelectedCourse}
						fetchCourses={fetchCourses}
						fetchCourseDetails={fetchCourseDetails}
					/>
				);
			case "courseQueues":
				return <CourseQueues courseID={selectedCourse._id} />;
			case "addUsers":
				return (
					<AddUsers
						courseID={selectedCourse._id}
						fetchCourseDetails={fetchCourseDetails}
					/>
				);
			case "manageUsers":
				return <ManageUsers courseID={selectedCourse._id} />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col space-y-4 min-h-96">
			<div className="flex items-center space-x-4">
				<button
					onClick={goBack}
					className="bg-slate-500 hover:bg-slate-600 base-button"
				>
					Go Back
				</button>
				<h2 className="text-2xl font-semibold">
					Course Details - <b>{selectedCourse.name}</b>
				</h2>
			</div>

			<div className="flex space-x-2">
				<button
					onClick={() => setSelectedOption("courseInfo")}
					className={`base-button ${
						selectedOption === "courseInfo"
							? "bg-blue-500"
							: " hover:bg-slate-900"
					}`}
					disabled={selectedOption === "courseInfo"}
				>
					Course Info
				</button>
				<button
					onClick={() => setSelectedOption("courseQueues")}
					className={`base-button ${
						selectedOption === "courseQueues"
							? "bg-blue-500"
							: "hover:bg-slate-900"
					}`}
					disabled={selectedOption === "courseQueues"}
				>
					Queues
				</button>
				<button
					onClick={() => setSelectedOption("addUsers")}
					className={`base-button ${
						selectedOption === "addUsers"
							? "bg-blue-500"
							: "hover:bg-slate-900"
					}`}
					disabled={selectedOption === "addUsers"}
				>
					Add Users
				</button>
				<button
					onClick={() => setSelectedOption("manageUsers")}
					className={`base-button ${
						selectedOption === "manageUsers"
							? "bg-blue-500"
							: "hover:bg-slate-900"
					}`}
					disabled={selectedOption === "manageUsers"}
				>
					Manage Users
				</button>
			</div>

			<div>{renderComponent()}</div>
		</div>
	);
};

export default CourseDetails;
