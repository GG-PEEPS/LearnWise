import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

const SubjectChat = (props: Props) => {
    const { subjectId } = useParams();
	return <div>SubjectChat</div>;
};

export default SubjectChat;
