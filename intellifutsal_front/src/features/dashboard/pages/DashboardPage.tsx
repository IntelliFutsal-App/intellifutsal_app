import { useState } from "react";
import { AIAnalysisSection, CoachOverview, FindTeamsSection, JoinRequestsSection, PlayerOverview, PlayersSection, PlayerTrainingsSection, Sidebar, TeamFieldSection, TeamsSection, TopBar, TrainingPlansSection } from "../components";
import { useAuth, useProfile } from "@shared/hooks";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const { user } = useAuth();
    const { profileState } = useProfile();

    const renderSection = () => {
        if (user?.role === 'COACH') {
            switch (activeSection) {
                case 'overview':
                    return <CoachOverview />;
                case 'teams':
                    return <TeamsSection />;
                case 'players':
                    return <PlayersSection />;
                case 'training-plans':
                    return <TrainingPlansSection role="COACH" />;
                case 'join-requests':
                    return <JoinRequestsSection />;
                case 'ai-analysis':
                    return <AIAnalysisSection />;
                case 'field-analysis':
                    return <TeamFieldSection />;
                default:
                    return <CoachOverview />;
            }
        } else {
            switch (activeSection) {
                case 'overview':
                    return <PlayerOverview />;
                case 'my-training':
                    return <PlayerTrainingsSection />;
                case 'find-teams':
                    return <FindTeamsSection />;
                case 'my-analysis':
                    return <AIAnalysisSection />;
                default:
                    return <PlayerOverview />;
            }
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/20 to-gray-50">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {user && <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} role={user.role} />}
            {(user && profileState) && <TopBar user={user} userResponse={profileState.profile}/>}

            <main className="lg:ml-64 lg:mt-20 pt-24 sm:pt-28 p-4 sm:p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-[1600px] mx-auto">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;