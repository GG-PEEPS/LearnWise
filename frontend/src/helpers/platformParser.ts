export default function platformParser(platform: "GOOGLECLASSROOM" | "LMS" | "TEAMS") {
    if (platform === "GOOGLECLASSROOM") {
        return "Google Classroom"
    }
    if (platform === "LMS") {
        return "Learning Management System"
    }
    if (platform === "TEAMS") {
        return "Microsoft Teams"
    }
}