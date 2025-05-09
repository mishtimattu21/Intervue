import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();

    useEffect(() => {
        setLoading(true);
        const interviewQuery = query(
            collection(db, "interviews"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(
            interviewQuery,
            (snapshot) => {
                const interviewList = snapshot.docs.map((doc) => {
                    const id = doc.id;
                    return {
                        id,
                        ...doc.data(),
                    };
                });
                setInterviews(interviewList);
                setLoading(false);
            },
            (error) => {
                console.log("Error on fetching : ", error);
                toast.error("Error..", {
                    description: "Something went wrong.. Try again later..",
                });
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return (
        <>
            <div className="flex w-full items-center justify-between">
                {/* Headings */}
                <Headings
                    title="Dashboard"
                    description="Create and start your AI Mock interview"
                    className="text-4xl font-bold" // Increased size
                />
                <Link to={"/generate/create"}>
                    <Button size={"lg"} className="text-lg px-6 py-3">
                        <Plus className="w-6 h-6" /> Add New
                    </Button>
                </Link>
            </div>

            <Separator className="my-8" />

            {/* Content Section */}
            <div className="md:grid md:grid-cols-3 gap-3 py-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 md:h-40 rounded-md" />
                    ))
                ) : interviews.length > 0 ? (
                    interviews.map((interview) => (
                        <InterviewPin key={interview.id} interview={interview} />
                    ))
                ) : (
                    <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
                        <img
                            src="/assets/svg/not-found.svg"
                            className="w-52 h-52 object-contain"
                            alt=""
                        />

                        <h2 className="text-xl font-semibold text-muted-foreground">
                            No Data Found
                        </h2>

                        <p className="w-full md:w-96 text-center text-lg text-neutral-400 mt-4">
                            There is no available data to show. Please add some new mock
                            interviews
                        </p>

                        <Link to={"/generate/create"} className="mt-6">
                            <Button size={"lg"} className="text-lg px-6 py-3">
                                <Plus className="w-6 h-6 mr-2" />
                                Add New
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};