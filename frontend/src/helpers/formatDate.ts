import moment from "moment";

const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    return moment(date).format("DD MMM YYYY");
};

export default formatDate;
