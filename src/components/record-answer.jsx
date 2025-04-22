/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/clerk-react";
import {
    CircleStop,
    Loader,
    Mic,
    RefreshCw,
    Save,
    Video,
    VideoOff,
    WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

export const RecordAnswer = ({ question, isWebCam, setIsWebCam }) => {
    const {
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    const [userAnswer, setUserAnswer] = useState("");
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { userId } = useAuth();
    const { interviewId } = useParams();

    const recordUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();

            if (userAnswer?.length < 30) {
                toast.error("Error", {
                    description: "Your answer should be more than 30 characters",
                });

                return;
            }

            //   ai result
            const aiResult = await generateResult(
                question.question,
                question.answer,
                userAnswer
            );

            setAiResult(aiResult);
        } else {
            startSpeechToText();
        }
    };

    const cleanJsonResponse = (responseText) => {
        // Step 1: Trim any surrounding whitespace
        let cleanText = responseText.trim();

        // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
        cleanText = cleanText.replace(/(json|```|`)/g, "");

        // Step 3: Parse the clean JSON text into an array of objects
        try {
            return JSON.parse(cleanText);
        } catch (error) {
            throw new Error("Invalid JSON format: " + error?.message);
        }
    };

    const generateResult = async (qst, qstAns, userAns) => {
        setIsAiGenerating(true);
        const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

        try {
            const aiResult = await chatSession.sendMessage(prompt);

            const parsedResult = cleanJsonResponse(aiResult.response.text());
            return parsedResult;
        } catch (error) {
            console.log(error);
            toast("Error", {
                description: "An error occurred while generating feedback.",
            });
            return { ratings: 0, feedback: "Unable to generate feedback" };
        } finally {
            setIsAiGenerating(false);
        }
    };

    const recordNewAnswer = () => {
        setUserAnswer("");
        stopSpeechToText();
        startSpeechToText();
    };

    const saveUserAnswer = async () => {
        setLoading(true);

        if (!aiResult) {
            return;
        }

        const currentQuestion = question.question;
        try {
            // query the firbase to check if the user answer already exists for this question

            const userAnswerQuery = query(
                collection(db, "userAnswers"),
                where("userId", "==", userId),
                where("question", "==", currentQuestion)
            );

            const querySnap = await getDocs(userAnswerQuery);

            // if the user already answerd the question dont save it again
            if (!querySnap.empty) {
                console.log("Query Snap Size", querySnap.size);
                toast.info("Already Answered", {
                    description: "You have already answered this question",
                });
                return;
            } else {
                // save the user answer

                await addDoc(collection(db, "userAnswers"), {
                    mockIdRef: interviewId,
                    question: question.question,
                    correct_ans: question.answer,
                    user_ans: userAnswer,
                    feedback: aiResult.feedback,
                    rating: aiResult.ratings,
                    userId,
                    createdAt: serverTimestamp(),
                });

                toast("Saved", { description: "Your answer has been saved.." });
            }

            setUserAnswer("");
            stopSpeechToText();
        } catch (error) {
            toast("Error", {
                description: "An error occurred while generating feedback.",
            });
            console.log(error);
        } finally {
            setLoading(false);
            setOpen(!open);
        }
    };

    useEffect(() => {
        const combineTranscripts = results
            .filter((result) => typeof result !== "string")
            .map((result) => result.transcript)
            .join(" ");

        setUserAnswer(combineTranscripts);
    }, [results]);

    return (
        <div className="w-full flex flex-col items-center gap-8 mt-4">
            {/* save modal */}
            <SaveModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={saveUserAnswer}
                loading={loading}
            />

            <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
                {isWebCam ? (
                    <WebCam
                        onUserMedia={() => setIsWebCam(true)}
                        onUserMediaError={() => setIsWebCam(false)}
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
                )}
            </div>

            <div className="flex itece justify-center gap-3">
                <TooltipButton
                    content={isWebCam ? "Turn Off" : "Turn On"}
                    icon={
                        isWebCam ? (
                            <VideoOff className="min-w-5 min-h-5" />
                        ) : (
                            <Video className="min-w-5 min-h-5" />
                        )
                    }
                    onClick={() => setIsWebCam(!isWebCam)}
                />

                <TooltipButton
                    content={isRecording ? "Stop Recording" : "Start Recording"}
                    icon={
                        isRecording ? (
                            <CircleStop className="min-w-5 min-h-5" />
                        ) : (
                            <Mic className="min-w-5 min-h-5" />
                        )
                    }
                    onClick={recordUserAnswer}
                />

                <TooltipButton
                    content="Record New Answer"
                    icon={<RefreshCw className="min-w-5 min-h-5" />}
                    onClick={recordNewAnswer}
                />

                <TooltipButton
                    content="Save Answer"
                    icon={<Save className="min-w-5 min-h-5" />}
                    onClick={() => setOpen(true)}
                />
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full flex flex-col items-center gap-2">
                    <h3 className="text-lg font-semibold">Your Answer</h3>
                    <p className="text-sm text-muted-foreground">
                        {isRecording ? "Recording..." : "Not Recording"}
                    </p>
                </div>

                <div className="w-full min-h-[100px] p-4 border rounded-md bg-gray-50">
                    {userAnswer ? (
                        <p>{userAnswer}</p>
                    ) : (
                        <p className="text-muted-foreground">No answer recorded yet</p>
                    )}
                </div>
            </div>

            {isAiGenerating && (
                <div className="w-full flex items-center justify-center gap-2">
                    <Loader className="min-w-4 min-h-4 animate-spin" />
                    <p>Generating feedback...</p>
                </div>
            )}

            {aiResult && (
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-full flex flex-col items-center gap-2">
                        <h3 className="text-lg font-semibold">AI Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                            Rating: {aiResult.ratings}/10
                        </p>
                    </div>

                    <div className="w-full min-h-[100px] p-4 border rounded-md bg-gray-50">
                        <p>{aiResult.feedback}</p>
                    </div>
                </div>
            )}
        </div>
    );
};