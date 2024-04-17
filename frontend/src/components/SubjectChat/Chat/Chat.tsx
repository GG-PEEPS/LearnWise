import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./ChatMessage/ChatMessage";

const Chat = () => {
	const messagesEndRef = useRef<null | HTMLDivElement>(null);
	const { subjectName, chats, addChat } = useContext(StudyContext);
	console.log(chats);
	const [message, setMessage] = useState("" as string);

	const handleSubmit = () => {
		addChat(message);
		setMessage("");
	};
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chats]);

	return (
		<Box
			sx={{
				height: "100%",
				width: "calc(100% - 264px)",
				marginY: 2,
				borderRadius: (theme) => theme.shape.borderRadius,
				border: "1px solid rgba(255, 255, 255, 0.12)",
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					position: "sticky",
					top: 0,
					borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
					padding: 2,
				}}
			>
				<Typography variant="h4">{subjectName}</Typography>
			</Box>
			<Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
				{chats.map((chat) => (
					<ChatMessage key={chat.id} chat={chat} />
				))}
				<div ref={messagesEndRef} />
			</Box>
			<Box
				sx={{
					position: "sticky",
					bottom: 0,
					borderTop: "1px solid rgba(255, 255, 255, 0.12)",
					padding: 2,
					display: "flex",
					gap: 2,
				}}
			>
				<TextField
					variant="outlined"
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						handleSubmit();
					}}
					startIcon={<SendIcon />}
				>
					Send
				</Button>
			</Box>
		</Box>
	);
};

export default Chat;
