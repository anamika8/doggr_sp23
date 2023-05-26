import { httpClient } from "@/Services/HttpClient.tsx";
import { useState } from "react";

export enum SubmissionStatus {
    NotSubmitted,
    SubmitFailed,
    SubmitSucceeded
}

export const Message = () => {};