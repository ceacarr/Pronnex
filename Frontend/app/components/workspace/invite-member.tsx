import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { inviteMemberSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Copy, Eye, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Label } from "../ui/label";
import { useInviteMemberMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = [
  {
    value: "admin",
    label: "Admin",
    description: "Full access",
    icon: ShieldCheck,
  },
  {
    value: "member",
    label: "Member",
    description: "Can collaborate",
    icon: UserRound,
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Read only",
    icon: Eye,
  },
] as const;

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState(false);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { mutate, isPending } = useInviteMemberMutation();

  const onSubmit = async (data: InviteMemberFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        workspaceId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully");
          form.reset();
          setInviteTab("email");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to send invite");
        },
      }
    );
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/workspace-invite/${workspaceId}`
    );
    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Workspace</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          value={inviteTab}
          onValueChange={setInviteTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" disabled={isPending}>
              <Mail className="size-4" />
              Send Email
            </TabsTrigger>
            <TabsTrigger value="link" disabled={isPending}>
              <Copy className="size-4" />
              Share Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex w-full flex-col space-y-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter email" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Role</FormLabel>
                            <FormControl>
                              <div className="grid gap-2 sm:grid-cols-3">
                                {ROLES.map((role) => (
                                  <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => field.onChange(role.value)}
                                    className={cn(
                                      "group relative rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                      field.value === role.value &&
                                        "border-primary bg-primary/5"
                                    )}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span
                                        className={cn(
                                          "flex size-9 items-center justify-center rounded-md border bg-muted text-muted-foreground transition-colors",
                                          field.value === role.value &&
                                            "border-primary bg-primary text-primary-foreground"
                                        )}
                                      >
                                        <role.icon className="size-4" />
                                      </span>
                                      <span
                                        className={cn(
                                          "flex size-5 items-center justify-center rounded-full border text-transparent",
                                          field.value === role.value &&
                                            "border-primary bg-primary text-primary-foreground"
                                        )}
                                      >
                                        <Check className="size-3" />
                                      </span>
                                    </div>

                                    <div className="mt-3">
                                      <p className="text-sm font-medium">
                                        {role.label}
                                      </p>
                                      <p className="mt-0.5 text-xs text-muted-foreground">
                                        {role.description}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      className="mt-6 w-full gap-2"
                      size="lg"
                      disabled={isPending}
                    >
                      <Mail className="size-4" />
                      {isPending ? "Sending..." : "Send Invite"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Share this link to invite people</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    readOnly
                    value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    disabled={isPending}
                    className="gap-2 sm:w-32"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="size-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can join this workspace
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
