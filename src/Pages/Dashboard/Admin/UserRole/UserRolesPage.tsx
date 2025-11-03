import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import AddUserRoleModal from "@/components/UserRole/AddUserRoleModal";
import { mockUserRoles } from "@/data/mockUserRoles";
import type { UserRole } from "@/types/userRole";
import { RoleGuard } from "@/components/RoleGuard";
import { Pagination } from "@/components/Shared/Pagination";

export default function UserRolesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>(mockUserRoles);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredRoles = useMemo(() => {
    return userRoles.filter((role) => {
      const matchesSearch = role.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, userRoles]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  const handleViewPermissions = (roleId: string) => {
    navigate(`/dashboard/user-roles/${roleId}/permissions`);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (roleName: string) => {
    const newRole: UserRole = {
      id: `role-${Date.now()}`,
      name: roleName,
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserRoles((prev) => [newRole, ...prev]);
    setIsAddModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      <DashboardHeader
        title="User Role"
        subtitle="Create Your Restaurant User Role"
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">User</h2>
            <RoleGuard allowedRole="admin">
              <Button
                onClick={handleAdd}
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Add User Role
              </Button>
            </RoleGuard>
          </div>

          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search user"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-4 border-input hover:bg-accent"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">No</th>
                  <th className="text-center p-4 font-semibold">Role</th>
                  <th className="text-center p-4 font-semibold">Permission</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={3} />
                ) : paginatedRoles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">No roles found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedRoles.map((role, index) => (
                    <tr
                      key={role.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {role.name}
                      </td>
                      <td className="p-2">
                        <Button
                          onClick={() => handleViewPermissions(role.id)}
                          className="bg-[#22C55E] hover:bg-[#22C55E]/80 text-white px-8 py-2 rounded-full"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && paginatedRoles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            showPrevNext={true}
            showIfSinglePage={false}
          />
        )}
      </main>

      <AddUserRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
      />
    </>
  );
}
