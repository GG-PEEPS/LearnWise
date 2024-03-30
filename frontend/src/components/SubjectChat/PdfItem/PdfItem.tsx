import { useContext } from "react";
import { StudyContext, pdfType } from "../../../context/StudyContextProvider";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
    pdf: pdfType;
};

const PdfItem = ({ pdf }: Props) => {
    const { deleteDocument } = useContext(StudyContext);
    const truncateName = (name: string, maxLength: number) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    textOverflow: "ellipsis",
                }}
            >
                {truncateName(pdf.title, 20)} 
            </Box>
            <Box
                sx={{
                    width: "1rem",
                    cursor: "pointer",
                }}
                onClick={() => {
                    deleteDocument(pdf.id);
                }}
            >
                <DeleteIcon />
            </Box>
        </Box>
    );
};

export default PdfItem;
