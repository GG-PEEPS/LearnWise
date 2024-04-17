import { Box, Typography } from "@mui/material";
import { chatType } from "../../../../context/StudyContextProvider";

type Props = {
	chat: chatType;
};

const ChatMessage = ({ chat }: Props) => {
	const isUser = chat.from_type === "USER";
	return (
		<Box
			key={chat.id}
			sx={{
				marginBottom: 2,
				display: "flex",
				justifyContent: isUser ? "flex-end" : "flex-start",
			}}
		>
			<Box
				sx={{
					maxWidth: "70%",
					padding: "0.5rem 1rem",
					borderRadius: "10px",
					backgroundColor: isUser ? "#2196F3" : "#f0f0f0",
					color: isUser ? "#fff" : "#333",
					textAlign: isUser ? "right" : "left",
				}}
			>
				{chat?.images && (
					<img
						src={import.meta.env.VITE_BACKEND_URL + chat.images}
						style={{ width: "100%	" }}
					/>
				)}

				<Typography variant="body1">{chat.message}</Typography>
			</Box>
		</Box>
	);
};

export default ChatMessage;
