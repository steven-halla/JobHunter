import React, { useContext } from "react";
import { JobsContext } from "../services/jobcontext";
import { Job } from "../models/Job";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from "styled-components";
import {device} from "../common/ScreenSizes";

export const JobsAppliedDateGraph: React.FC = () => {
    const { jobs } = useContext(JobsContext);

    // Helper function to check if a date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
    };

    const getStartOfWeek = (date: Date): Date => {
        const result = new Date(date);
        const day = date.getDay();
        const difference = date.getDate() - day;
        result.setDate(difference);
        result.setHours(0, 0, 0, 0);
        return result;
    };

    const isInSameWeek = (date1: Date, date2: Date): boolean => {
        return getStartOfWeek(date1).getTime() === getStartOfWeek(date2).getTime();
    };

    const isInCurrentMonth = (date: Date): boolean => {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getWeeksInMonth = (date: Date): { start: Date, end: Date }[] => {
        const weeks: { start: Date, end: Date }[] = [];
        const month = date.getMonth();
        date.setDate(1);
        while (date.getMonth() === month) {
            weeks.push({
                start: getStartOfWeek(new Date(date)),
                end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()))
            });
            date.setDate(date.getDate() + (7 - date.getDay()));
        }
        return weeks;
    };

    const today = new Date();

    const jobsAppliedToday: Job[] = jobs.filter(job => isToday(new Date(job.dateapplied)));
    const jobsAppliedThisWeek: Job[] = jobs.filter(job => isInSameWeek(new Date(job.dateapplied), today));
    const jobsAppliedThisMonth: Job[] = jobs.filter(job => isInCurrentMonth(new Date(job.dateapplied)));

    const weeks = getWeeksInMonth(today);
    const dataForBarChart = weeks.map(week => ({
        name: `${week.start.getDate()}-${week.end.getDate()}`,
        Jobs: jobs.filter(job => {
            const jobDate = new Date(job.dateapplied);
            return jobDate >= week.start && jobDate <= week.end;
        }).length
    }));

    return (

        <JobsAppliedDateGraphDiv>
            <GraphContainer>

                <MonthPickerDiv>

                    <select>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </MonthPickerDiv>
                <NumberOfJobsAppliedDiv>
                    {/* Content for NumberOfJobsAppliedDiv */}
                </NumberOfJobsAppliedDiv>
                <BarGraphDiv>
                    {/* Content for BarGraphDiv */}
                </BarGraphDiv>
            </GraphContainer>
        </JobsAppliedDateGraphDiv>

    );
};
//
// {/*<p>Hi I'm the jobs applied graph</p>*/}
// {/*<p>Jobs applied today: {jobsAppliedToday.length}</p>*/}
// {/*<p>Jobs applied this week: {jobsAppliedThisWeek.length}</p>*/}
// {/*<p>Jobs applied this month: {jobsAppliedThisMonth.length}</p>*/}
//
// {/*<ResponsiveContainer width="80%" height={400}>*/}
// {/*    <BarChart*/}
// {/*        data={dataForBarChart}*/}
// {/*        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}*/}
// {/*    >*/}
// {/*        <CartesianGrid strokeDasharray="3 3" />*/}
// {/*        <XAxis dataKey="name" />*/}
// {/*        <YAxis />*/}
// {/*        <Tooltip />*/}
// {/*        <Legend />*/}
// {/*        <Bar dataKey="Jobs" fill="#8884d8" />*/}
// {/*    </BarChart>*/}
// {/*</ResponsiveContainer>*/}

export const JobsAppliedDateGraphDiv = styled.div`
  display: flex;
  background-color: red;
  height: 100vh;
  width: 100vw;
  justify-content: center; /* Centers content horizontally */
  //align-items: center; /* Centers content vertically */
`;

export const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers content horizontally within the column */
`;

export const NumberOfJobsAppliedDiv = styled.div`
  background-color: purple;
  height: 15vh;
  width: 70vw;
`;

export const BarGraphDiv = styled.div`
  background-color: yellow;
  height: 60vh;
  width: 70vw;
`;


export const MonthPickerDiv = styled.div`
  display: flex;
  background-color: #ffb852;
  height: 10vh;
  width: 70vw;
  align-items: center;
  justify-content: center; /* Centers content horizontally */
  //align-items: center; /* Centers content vertically */
  
  select {
    height: 30px;
  }
`;