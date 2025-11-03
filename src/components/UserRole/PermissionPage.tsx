import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { mockUserRoles, mockPermissions } from "@/data/mockUserRoles";
import type { UserRole, Permission } from "@/types/userRole";

export default function PermissionPage() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId: string }>();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundRole = mockUserRoles.find((r) => r.id === roleId);

      if (foundRole) {
        setRole(foundRole);
        setPermissions(
          foundRole.permissions.length > 0
            ? JSON.parse(JSON.stringify(foundRole.permissions))
            : JSON.parse(JSON.stringify(mockPermissions))
        );
      } else {
        toast.error("Role not found");
        navigate("/dashboard/user-roles");
      }

      setIsLoading(false);
    };

    fetchRole();
  }, [roleId, navigate]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((permission) => {
      if (!groups[permission.category]) {
        groups[permission.category] = [];
      }
      groups[permission.category].push(permission);
    });
    return groups;
  }, [permissions]);

  const handleParentToggle = (parentId: string) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === parentId ? { ...p, isEnabled: !p.isEnabled } : p
      )
    );
  };

  const handleChildToggle = (parentId: string, childId: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === parentId && p.children) {
          return {
            ...p,
            children: p.children.map((c) =>
              c.id === childId ? { ...c, isEnabled: !c.isEnabled } : c
            ),
          };
        }
        return p;
      })
    );
  };

  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Permissions updated successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-4 md:p-5.5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/user-roles")}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Permission</h1>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-left p-4 font-semibold w-1/4">Role</th>
                  <th className="text-left p-4 font-semibold w-3/4">
                    Permission
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-6 align-top bg-background">
                    <span className="font-medium text-foreground text-lg">
                      {role.name}
                    </span>
                  </td>
                  <td className="p-6 bg-background">
                    <div className="space-y-8">
                      {Object.entries(groupedPermissions).map(
                        ([category, perms]) => (
                          <div key={category} className="space-y-4">
                            <h3 className="text-primary font-semibold text-base">
                              {category}
                            </h3>
                            <div className="space-y-4">
                              {perms.map((permission) => (
                                <div key={permission.id} className="space-y-2">
                                  {/* Parent Permission with Switch */}
                                  <div className="flex items-center gap-3">
                                    <Switch
                                      id={permission.id}
                                      checked={permission.isEnabled}
                                      onCheckedChange={() =>
                                        handleParentToggle(permission.id)
                                      }
                                    />
                                    <label
                                      htmlFor={permission.id}
                                      className="text-sm font-medium text-foreground cursor-pointer select-none"
                                    >
                                      {permission.name}
                                    </label>
                                  </div>

                                  {/* Child Permissions with Checkboxes */}
                                  {permission.children &&
                                    permission.children.length > 0 && (
                                      <div className="ml-12 space-y-2">
                                        {permission.children.map((child) => (
                                          <div
                                            key={child.id}
                                            className="flex items-center gap-2"
                                          >
                                            <Checkbox
                                              id={child.id}
                                              checked={child.isEnabled}
                                              onCheckedChange={() =>
                                                handleChildToggle(
                                                  permission.id,
                                                  child.id
                                                )
                                              }
                                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label
                                              htmlFor={child.id}
                                              className="text-sm text-foreground cursor-pointer select-none"
                                            >
                                              {child.name}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border w-full flex justify-end items-center bg-background">
            <Button
              onClick={handleSave}
              className="w-full md:w-auto px-8 h-12 rounded-md bg-primary hover:bg-primary/80 text-white"
            >
              Save Permissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
