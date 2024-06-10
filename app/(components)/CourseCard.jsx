import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CourseCard = ({ id, name }) => {
	const router = useRouter();
	const { data: session } = useSession();

	const handleClick = () => {
		if (
			session?.user?.role === "instructor" ||
			session?.user?.role === "TA"
		) {
			router.push(`/CourseManage/${id}`);
		} else {
			router.push(`/CourseQueue/${id}`);
		}
	};

	return (
		<div
			className="flex flex-col bg-blue-400 hover:bg-blue-500 rounded-md p-3 m-2 cursor-pointer"
			onClick={handleClick}
		>
			{name}
		</div>
	);
};

export default CourseCard;
