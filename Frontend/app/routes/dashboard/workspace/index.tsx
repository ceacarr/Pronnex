import {  Link } from "react-router";
import { useState } from "react";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { Loader, PlusCircle, Users } from "lucide-react";
import type { Workspace } from "@/types";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { NoDataFound } from "@/components/no-data-found";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import {format} from "date-fns";


const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const {data: workspaces, isLoading} = useGetWorkspacesQuery() as {
        data: Workspace[];
        isLoading: boolean;
    };

    if (isLoading) {
        return <Loader />;
    }
       return (
       <>
       <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Workspaces</h2>
            <Button onClick={() => setIsCreatingWorkspace(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Workspace
            </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
                <WorkspaceCard key={ws._id} workspace={ws} />
            ))}
               { workspaces.length === 0 && (
                    <NoDataFound 
                        title="No workspaces found"
                        description="Create your first workspace to get started!"
                        buttonText="Create Workspace"
                        buttonAction={() => setIsCreatingWorkspace(true)}
                    />
                )}            
        </div>
       </div>
       <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
       />
       </>
       );
    };
     
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => { 
    return (
       <Link to= {`/workspace/${workspace._id}`} >
        <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                        <WorkspaceAvatar
                        name={workspace.name}
                        color={workspace.color}
                        />
                        <div className="">
                            <CardTitle className="font-medium">
                               {workspace.name}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground p-2 pt-0">
                                Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a") }
                            </span>
                                
                        </div>
                    </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="size-4 mr-2" />
                    <span className="text-xs">
                        {workspace.members.length}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                    {workspace.description || "No description provided"}
                </CardDescription>
            </CardHeader>
        </Card>
       </Link>
    );
}   

export default Workspaces;     