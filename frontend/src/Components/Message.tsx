import { httpClient, getProfileById } from "@/Services/HttpClient.tsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";

export const Message = () => {
    const [currentProfile, setCurrentProfile] = useState<ProfileType>();
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const location = useLocation();
    const auth = useAuth();

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const fetchCurrentProfile = (id) => {
        getProfileById(id)
            .then((response) => setCurrentProfile(response))
            .catch((err) => console.log("Error in fetch profile", err));
    };

    useEffect(() => {
        const selectedProfileId = location.state.receiverId;
        fetchCurrentProfile(selectedProfileId);
    }, [location.state.receiverId]);

    const handleSendMessage = () => {
        setSending(true);

        const payload = {
            sender_id: auth.userId,
            receiver_id: location.state.receiverId,
            message: message,
        };

        httpClient
            .post("/messages", payload)
            .then((response) => {
                if (response.status === 200) {
                    setSubmitted(true);
                } else {
                    setSubmitted(false);
                }
            })
            .catch((error) => {
                console.log("Error sending message:", error);
                setSubmitted(false);
            })
            .finally(() => {
                setSending(false);
                setMessage("");
            });
    };

    return (
        <div className="flex flex-col items-center bg-slate-700 w-4/5 mx-auto p-5 rounded-box">
            {/* Display user profile picture */}
            <img
                src={null}
                alt="Profile Picture"
                className="w-16 h-16 rounded-full mb-5"
            />

            {/* Text entry box for the message */}
            <div className="flex flex-col w-full mb-5">
                <label htmlFor="message" className="text-blue-300 mb-2">
                    Message:
                </label>
                <textarea
                    placeholder="Type your message..."
                    id="message"
                    required
                    value={message}
                    onChange={handleMessageChange}
                    name="message"
                    className="input input-bordered"
                />
            </div>

            {/* Send button */}
            <button
                className="btn btn-primary btn-circle"
                onClick={handleSendMessage}
                disabled={sending || message === ""}
            >
                {sending ? "Sending..." : "Send"}
            </button>

            {/* Display submission status */}
            {submitted && (
                <p className="text-green-500 mt-2">Message submitted successfully!</p>
            )}
            {!submitted && submitted !== null && (
                <p className="text-red-500 mt-2">Failed to submit the message.</p>
            )}
        </div>
    );
};
