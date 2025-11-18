import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";

const PermissionComponent = () => {
  const permissionsList = ["entry_process"];
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Format permission label for user view
  const formatPermissionLabel = (perm) =>
    perm.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  // Fetch roles and initialize permissions
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesResponse = await axios.get(`${API_URL}/api/roles`);
        if (rolesResponse.data.success) {
          const fetchedRoles = rolesResponse.data.data;
          setRoles(fetchedRoles);
          setLoading(false);

          // Fetch permissions for roles
          const permissionsResponse = await axios.get(
            `${API_URL}/api/roles/permissions`
          );
          if (permissionsResponse.data.permissions) {
            const permissionsData = permissionsResponse.data.permissions;

            // Initialize permissions state based on fetched permissions
            const initialPermissions = {};
            fetchedRoles.forEach((role) => {
              initialPermissions[role.id] = permissionsList.reduce(
                (acc, perm) => {
                  const permission = permissionsData.find(
                    (p) => p.role_id === role.id && p.permission === perm
                  );
                  acc[perm] = permission ? permission.status === "1" : false; // Set true if status is 1, false otherwise
                  return acc;
                },
                {}
              );
            });

            setPermissions(initialPermissions);
            setLoading(false);
          }
        } else {
          console.error("Failed to fetch roles.");
        }
      } catch (err) {
        console.error("Error fetching roles and permissions:", err);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle permission toggle
  const handlePermissionChange = (roleId, perm) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [roleId]: {
        ...prevPermissions[roleId],
        [perm]: !prevPermissions[roleId][perm],
      },
    }));
  };

  // Submit updated permissions
  const handleSubmit = () => {
    const formattedPermissions = roles.map((role) => ({
      roleId: role.id,
      permissions: permissions[role.id],
    }));

    axios
      .post(`${API_URL}/api/roles/update-permissions`, formattedPermissions)
      .then((response) => {
        console.log("Permissions updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating permissions:", error);
      });
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />

            <p className="font-semibold text-2xl">Permission</p>

            <div className="flex flex-col gap-12 mt-12 bg-white rounded-2xl px-8 py-8 w-fit">
              {/* Dynamic Permission Sections */}
              {roles.map((role) => (
                <div className="flex gap-32 items-center" key={role.id}>
                  <p className="w-24">{capitalizeFirstLetter(role.name)}</p>
                  {/* Permissions checkboxes for each role */}
                  <div className="flex gap-10">
                    {permissionsList.map((perm) => (
                      <div className="flex items-center gap-4" key={perm}>
                        <input
                          type="checkbox"
                          checked={permissions[role.id]?.[perm] || false}
                          onChange={() => handlePermissionChange(role.id, perm)}
                        />
                        <p
                          onClick={() => handlePermissionChange(role.id, perm)}
                          className="cursor-pointer"
                        >
                          {formatPermissionLabel(perm)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-5">
                <button className="bg-blue-600 text-white px-3 py-2 rounded-xl w-20">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gray-600 text-white px-3 py-2 rounded-xl w-20"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default PermissionComponent;
