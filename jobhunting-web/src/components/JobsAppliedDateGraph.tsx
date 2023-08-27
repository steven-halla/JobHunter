import React, { useContext } from "react";
import { JobsContext } from "../services/jobcontext";
import { Job } from "../models/Job";

export const JobsAppliedDateGraph: React.FC = () => {
    const { jobs } = useContext(JobsContext);

    // Helper function to check if a date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetting hours, minutes, seconds, and milliseconds
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
    }

    const getStartOfWeek = (date: Date): Date => {
        const result = new Date(date);
        const day = date.getDay();
        const difference = date.getDate() - day;
        result.setDate(difference);
        result.setHours(0, 0, 0, 0); // Resetting hours, minutes, seconds, and milliseconds
        return result;
    };

    // Helper function to check if two dates fall in the same week
    const isInSameWeek = (date1: Date, date2: Date): boolean => {
        return getStartOfWeek(date1).getTime() === getStartOfWeek(date2).getTime();
    }

    // Helper function to check if a date is in the current month
    const isInCurrentMonth = (date: Date): boolean => {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    const today = new Date();

    // Filter jobs to include only those applied today
    const jobsAppliedToday: Job[] = jobs.filter(job => isToday(new Date(job.dateapplied)));

    // Filter jobs to include only those applied in the current week
    const jobsAppliedThisWeek: Job[] = jobs.filter(job => isInSameWeek(new Date(job.dateapplied), today));

    // Filter jobs to include only those applied in the current month
    const jobsAppliedThisMonth: Job[] = jobs.filter(job => isInCurrentMonth(new Date(job.dateapplied)));

    return (
        <div>
            <p>Hi I'm the jobs applied graph</p>
            <p>Jobs applied today: {jobsAppliedToday.length}</p>
            <p>Jobs applied this week: {jobsAppliedThisWeek.length}</p>
            <p>Jobs applied this month: {jobsAppliedThisMonth.length}</p>
        </div>
    );
};
