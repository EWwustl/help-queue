const Courses = ({ courses, fetchCourseDetails, children }) => {
	return (
		<div className="flex flex-col space-y-2">
			<h2 className="text-2xl font-semibold self-center">{children}</h2>

			{courses.length === 0 && <p>Loading... (or no courses yet)</p>}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				{courses.map((course) => (
					<button
						key={course._id}
						onClick={() => fetchCourseDetails(course._id)}
						className="text-2xl bg-blue-500 hover:bg-blue-600 base-button"
					>
						{course.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default Courses;
