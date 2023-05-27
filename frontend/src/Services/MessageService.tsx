import { httpClient } from "@/Services/HttpClient.tsx";

export const MessageService = {
    async send(sender_id: number, receiver_id: number) {
        console.log(`sender ${sender_id}, receiver  ${receiver_id}`);
        return httpClient.post("/messages", {sender_id, receiver_id, message: null});
    }
};